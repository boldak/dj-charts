'use strict';
//native libraries
const http = require('http');
const fs = require('fs');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

//in-project libraries
const lib = require('./server-lib.js');

if (cluster.isMaster) {
  console.log('opened server');
  let i;
  for (i = 0; i < numCPUs; i++)
    cluster.fork();
} else {
  http.createServer((request, response) => {
    let body = '';
    request.on('data', (chunk) => (body += chunk))
      .on('end', () => {
        if (request.url === '/') {
          response.setHeader('Content-type', 'text/plain');
          const config = JSON.parse(body);
          switch (config.format) {
            case 'svg':
            case 'xdot':
            case 'plain':
            case 'ps':
            case 'json':
              lib.textBasedProcess(config, (url) => (response.end(url)));
              break;
            case 'png':
              lib.rasterBasedProcess(config,(url) => (response.end(url)));
              break;
            default:
              response.end('');
          }
        } else {
          fs.readFile('.' + request.url, (err, data) => {
            response.setHeader('Content-type', 'image');
            response.end(data);
          });
        }
      });
  }).listen(1337, '127.0.0.1');
}
