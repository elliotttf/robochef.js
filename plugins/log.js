/**
 * @fileoverview Logging for RoboChef.
 */
var mongoose = require('mongoose');
var logs = mongoose.model('logs', require('../models/models.js').logs);

var Log = exports;

Log.attach = function(client) {
  var self = this;
  self.client = client;

  /**
   * Logs a message to the database.
   *
   * @param {string} from
   *   The user the message was sent by.
   * @param {string} to
   *   The channel the message was sent to.
   * @param {string} message
   *   The message to log.
   */
  function log(from, to, message) {
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

  this.on('message', function onMessage(data) {
    log(data.from, data.to, data.message);
  });

  this.on('selfMessage', function onSelfMessage(data) {
    log(self.client.opt.nick, data.to, data.message);
  });
};

Log.init = function(done) {
  return done();
};

