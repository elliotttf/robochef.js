/**
 * @fileoverview Handles listing and creating new alarms.
 */

var Plates = require('plates');
var mongoose = require('mongoose');
var logs = mongoose.model('logs', require('../models/models.js').logs);

var Log = exports;

Log.send = function(res) {
  logs.distinct('channel', {}, function channelLogs(err, docs) {
    if (err) {
      console.error(err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('lol wut?');
      return;
    }

    var html = require('fs').readFileSync('./views/log.html', 'UTF-8');
    var logsList = '';
    for (var x in docs) {
      logsList += '<li><a href="/log/' + escape(docs[x]) + '">' + docs[x] + '</a></li>';
    }

    var map = Plates.Map();


    var data = {
      logs: logsList
    };
    map.where('id').is('logs').use('logs');

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(Plates.bind(html, data, map));
  });
};

