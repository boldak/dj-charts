'use strict';
const http = require('http');

const lib = {};
module.exports = lib;

//config which will be send to server
const config = {
  text: '',
  format: 'svg'
};

//options for connection to server
const options = {
  host: '127.0.0.1',
  port: '1337',
  method: 'POST'
};

//required
//set text but erases previous config
//input parameters:
//  text - dot syntax string
lib.setText = (text) => {
  config.text = text;
  config.format = 'svg';
  config.engine = undefined;
  config.width = undefined;
  config.heigth = undefined;
};

//optional
//set output engine for render
//<'circo'|'dot'|'neato'|'osage'|'twopi'>
//input parameters:
//  engine - string with one of engines
lib.setEngine = (engine) => {
  switch (engine) {
    case 'circo':
    case 'dot':
    case 'neato':
    case 'osage':
    case 'twopi':
      config.engine = engine;
      break;
    default:
  }
};

//optional
//set output format for render
//<'svg'|'xdot'|'plain'|'ps'|'json'|'png'>
//input parameters:
//  format - string with one of formats
lib.setFormat = (format) => {
  switch (format) {
    case 'svg':
    case 'xdot':
    case 'plain':
    case 'ps':
    case 'json':
    case 'png':
      config.format = format;
      break;
    default:
  }
};

//optional
//set output width(usable only for png)
//in case of appcense it will be scaled
//by heigth if it is available
//input parameters:
//  width - positive number
lib.setWidth = (width) => {
  if (Number.isInteger(width) && width > 0)
    config.width = width;
};

//optional
//set output heigth(usable only for png)
//in case of appcense it will be scaled
//by width if it is available
//input parameters:
//  heigth - positive number
lib.setHeigth = (heigth) => {
  if (Number.isInteger(heigth) && heigth > 0)
    config.heigth = heigth;
};

//required
//get url of result
//output:
//  Promise, wich resolves url
lib.getUrl = () => new Promise((resolve) => {
  if (!config.text) {
    resolve('uncorrect text');
    return;
  }

  const req = http.request(options, (response) => {
    let data = '';
    response.on('data', (chunk) => (data += chunk));
    response.on('end', () => {
      resolve(data);
    });
  });
  req.write(JSON.stringify(config));
  req.end();
});
