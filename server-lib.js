'use strict'
//native libraries
const crypto = require('crypto');
const fs = require('fs');

//external libraries
const viz = require('viz.js');
const svg2png = require('svg2png');

const lib = {};
module.exports = lib;

const imagesPath = '/imgs';

//render text-based format file
//if it is not generated
//input parameters:
//  config object, generated by client
//  callback which takes url
lib.textBasedProcess = (config, callback) => {
  const svg = viz(config.text, {
    format: config.format,
    engine: config.engine
  });
  const hash = crypto.createHash('sha256')
    .update(svg)
    .digest('hex');
  const url = `${imagesPath}/${hash}.${config.format}`;

  if(!fs.existsSync('.' + url)) mkdirSync('.' + url);
  fs.access('.' + url, (err) => {
    if (err) {
      fs.writeFile('.' + url, svg, () => {
        callback(url);
      });
    } else {
      callback(url);
    }
  });
};

//render raster-based format file
//if it is not generated
//input parameters:
//  config object, generated by client
//  callback which takes url
lib.rasterBasedProcess = (config, callback) => {
  const svg = viz(config.text, {
    format: 'svg',
    engine: config.engine || 'circo'
  });
  const hash = crypto.createHash('sha256')
    .update('' + config.width + svg + config.height)
    .digest('hex');
  const url = `${imagesPath}/${hash}.png`;

  if(!fs.existsSync('.' + url)) mkdirSync('.' + url);
  fs.access('.' + url, (err) => {
    if (err) {
      svg2png(new Buffer(svg), {
        width: config.width,
        height: config.heigth
      })
        .then((buffer) => fs.writeFile('.' + url, buffer, () => {
          callback(url);
        }));
    } else {
      callback(url);
    }
  });
};