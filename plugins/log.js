/**
 * @fileoverview Logging for RoboChef.
 */
var mongoose = require('mongoose');
var logs = mongoose.model('logs', require('../models/models.js').logs);

var Log = exports;

Log.attach = function() {
  this.message = function(from, to, message) {
    var logItem = new logs();
    logItem.time = Date.now();
    logItem.channel = to;
    logItem.nick = from;
    logItem.message = message;
    logItem.save(function onSave(err) {
      if (err) {
        console.error(err);
      }
    });
  }
};

Log.init = function(done) {
  return done();
}

