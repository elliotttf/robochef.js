/*
 * GET home page.
 */

var index = exports;

index.send = function(res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('RoboChef');
};

