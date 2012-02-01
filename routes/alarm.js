/**
 * @fileoverview Handles listing and creating new alarms.
 */

var mongoose = require('mongoose');
var alarm = mongoose.model('alarms', require('../models/models.js').alarms);

exports.alarm = function(req, res) {
  if (req.method === 'POST') {
    upsertAlarm(req.body);
  }

  alarm.find({}, function(err, docs) {
    var alarms = [];
    if (err) {
      console.error(err);
      res.send('lol wut?', 500);
      return;
    }
    for (var x = 0; x < docs.length; x++) {
      // Convert date to local time.
      var d = new Date();
      d.setUTCHours(docs[x].hour);
      d.setUTCMinutes(docs[x].minute);

      var diff = d.getUTCDay() - d.getDay();
      var days = '';
      for (var i = 0; i < docs[x].days.length; i++) {
        if (diff != 0) {
          docs[x].days[i] += diff;
        }
        var day = 'Sun';
        switch (docs[x].days[i]) {
          case '1':
            day = 'Mon';
            break;
          case '2':
            day = 'Tue';
            break;
          case '3':
            day = 'Wed';
            break;
          case '4':
            day = 'Thu';
            break;
          case '5':
            day = 'Fri';
            break;
          case '6':
            day = 'Sat';
            break;
        }
        days += day;

        if ((i + 1) < docs[x].days.length) {
          days += ', ';
        }
      }

      var a = {
        'id': docs[x]._id,
        'message': docs[x].message,
        'time': d.getHours() + ':' + d.getMinutes(),
        'days': days,
        'channels': docs[x].channels.join(', ')
      };
      alarms.push(a);
    }
    res.render(
      'alarm',
      {
        'title': 'Bot alarm',
        'alarms': alarms
      }
    );
  });
};

function upsertAlarm(body) {
  var a = new alarm();
  // Convert the date to UTC.
  var d = new Date();
  var tary = body.time.split(':');
  d.setHours(tary[0]);
  d.setMinutes(tary[1]);

  // Handle a date offset in the event that UTC is on a different day.
  var diff = d.getUTCDay() - d.getDay();
  if (diff != 0) {
    for (var x = 0; x < body.days.length; x++) {
      body.days[x] += diff;
    }
  }

  a.message = body.message;
  a.hour = d.getUTCHours();
  a.minute = d.getUTCMinutes();
  a.days = body.days;
  a.channels = body.channels.split(',');
  a.save();
}

