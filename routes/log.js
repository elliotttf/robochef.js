/**
 * @fileoverview Handles listing and creating new alarms.
 */

var mongoose = require('mongoose');
var logs = mongoose.model('logs', require('../models/models.js').logs);

var Log = exports;

Log.send = function(res) {
  logs.distinct('channel', {}, function channelLogs(err, docs) {
    if (err) {
      console.error(err);
      res.send('lol wut?', 500);
      return;
    }

    var log = [];
    for (var x in docs) {
      var l = {
        'name': docs[x],
        'path': '/log/' + escape(docs[x])
      };
      log.push(l);
    }
    res.render(
      'log',
      {
        'title': 'Logs',
        'logs': log
      }
    );
  });
};

