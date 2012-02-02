/*
 * GET home page.
 */

var Plates = require('plates');

var index = exports;

index.send = function(res) {
  var html = require('fs').readFileSync('./views/index.html', 'UTF-8');
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
};

