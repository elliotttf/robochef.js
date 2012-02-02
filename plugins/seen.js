/**
 * @fileoverview Implements 'seen' functionality.
 */

var mongoose = require('mongoose');
var logs = mongoose.model('logs', require('../models/models.js').logs);

var Seen = exports;

Seen.attach = function(client) {
  var self = this;

  this.on('message', function onMessage(data) {
    var re = new RegExp(
      "^seen ([a-zA-Z0-9\\[\\]\\{\\}\\\\\\|\\^\\`\\-\\_\\*]*)( ?\\?|$)",
      'i'
    );
    var matches = re.exec(data.message);

    if (matches === null) {
      return;
    }

    logs
      .where('nick', matches[1])
      .sort('time', -1)
      .limit(1)
      .run(function foundOne(err, docs) {
        if (err) {
          console.error(err);
          return;
        }

        if (docs.length != 1) {
          return;
        }

        client.say(
          data.to,
          matches[1] + ' was last seen in ' +
            docs[0].channel + ' at ' + docs[0].time +
            " saying '" + docs[0].message + "'."
        );
      });
  });
};

Seen.init = function(done) {
  return done();
};

