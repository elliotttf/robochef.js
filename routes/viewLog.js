/**
 * @fileoverview Handles listing and creating new alarms.
 */

var mongoose = require('mongoose');
var logs = mongoose.model('logs', require('../models/models.js').logs);

exports.viewLog = function(req, res) {
  var query = logs.find({ 'channel': req.params.channel});
  query.sort('time', -1);
  query.exec(function foundLogs(err, docs) {
    if (err) {
      console.error(err);
      res.send('lol wut?', 500);
      return;
    }

    var logItems = [];
    for (var x in docs) {
      logItems.push(docs[x]);
    }
    res.render(
      'viewLog',
      {
        'title': 'Logs for ' + req.params.channel,
        'logs': logItems
      }
    );
  });
};

