/**
 * @fileoverview Bot alarm for RoboChef.
 */

var mongoose = require('mongoose');
var alarms = mongoose.model('alarms', require('../models/models.js').alarms);

var Alarm = exports;

Alarm.attach = function(client) {
  var self = this;

  self.client = client;
  self.date = new Date();
};

Alarm.init = function(done) {
  var self = this;

  alarms.find({}, function foundAlarms(err, docs) {
    for (var x = 0; x < docs.length; x++) {
      for (var day = 0; day < docs[x].days.length; day++) {
        var nextDate = new Date();
        var timeout = 0;

        nextDate.setUTCHours(docs[x].hour);
        nextDate.setUTCMinutes(docs[x].minute);
        nextDate.setUTCSeconds(0);

        if (self.date.getUTCDay() == docs[x].days[day]) {
          timeout = nextDate.getTime() - self.date.getTime();
          // If the time already passed set the interval to execute in one week.
          if (timeout <= 0) {
            timeout += 604800000;
          }
        }
        else if (self.date.getUTCDay() < docs[x].days[day]) {
          nextDate.setTime(
            nextDate.getTime() +
            ((docs[x].days[day] - self.date.getUTCDay()) * 86400000)
          );

          timeout = nextDate.getTime() - self.date.getTime();
        }
        else {
          nextDate.setTime(
            nextDate.getTime() +
            ((docs[x].days[day] - self.date.getUTCDay()) * 86400000) +
            604800000
          );

          timeout = nextDate.getTime() - self.date.getTime();
        }

        setTimeout(
          function(channels, message) {
            self.sendLoop(channels, message);
          },
          timeout,
          docs[x].channels,
          docs[x].message
        );
      }
    }
  });

  return done();
};

/**
 * Sets up the interval loop for a given alarm.
 *
 * @param {array} channels
 *   The list of channels to send the alarm message to.
 * @param {string} message
 *   The message to send to channels.
 */
Alarm.sendLoop = function(channels, message) {
  var self = this;

  for (var x = 0; x < channels.length; x++) {
    var to = channels[x];
    self.client.say(to, message);

    // Repeat the alarm in one week.
    setInterval(self.client.say, 604800000, to, message);
  }
};

