/**
 * @fileoverview Handles listing and creating new alarms.
 */

var Plates = require('plates');
var mongoose = require('mongoose');
var logs = mongoose.model('logs', require('../models/models.js').logs);

var ViewLog = exports;

ViewLog.send = function(res, channel) {
  var query = logs.find({ 'channel': channel});
  query.sort('time', -1);
  query.exec(function foundLogs(err, docs) {
    if (err) {
      console.error(err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('lol wut?');
      return;
    }

    var rows = '';
    for (var x = 0; x < docs.length; x++) {
      rows += '<tr><td>' + docs[x].time + '</td><td>' + docs[x].nick + '</td><td>' + docs[x].message + '</td></tr>';
    }

    var map = Plates.Map();
    map.where('id').is('logbody').use('rows');
    map.where('class').is('title').use('title');

    var html = require('fs').readFileSync('./views/viewLog.html', 'UTF-8');
    var data = {
      title: 'Logs for ' + channel,
      rows: rows,
    };

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(Plates.bind(html, data, map));
  });
};

