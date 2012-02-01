/**
 * @fileoverview Tell plugin for RoboChef.
 */

var mongoose = require('mongoose');
var tells = mongoose.model('tells', require('../models/models.js').tells);

var Tell = exports;

Tell.attach = function(client) {
  var self = this;

  self.client = client;
  self.options = require('../local.js');

  self.message = function(from, to, message) {
    var re = new RegExp(
      "^\\s*" + self.options.irc.nick + "[:;,-]?\\s*tell" +
      "\\s+([a-zA-Z0-9\\[\\]\\{\\}\\\\\|\\^\\`\\-\\_\\*]*)" +
      "[:;,]?\\s+(.*)$",
      'i'
    );
    var matches = re.exec(message);
    if (matches !== null) {
      var d = new Date();
      var logTell = new tells();
      logTell.from = from
      logTell.to = to;
      logTell.tellTo = matches[1];
      logTell.message = matches[1] + ': at ' +
        d.toUTCString() + ' ' + from + ' said: ' + matches[2];
      logTell.save(function onSave(err) {
        if (err) {
          console.log(err);
        }
      });
    }

    tells.find(
      { 'to': to, 'tellTo': from },
      function (err, docs) {
        if (err) {
          console.error(err);
          return;
        }

        for (var x in docs) {
          client.say(
            docs[x].to,
            docs[x].message
          );
          tells.remove(
            { 'to': to, 'tellTo': from },
            function onRemove(err) {
              if (err) {
                console.error(err);
              }
            }
          );
        }
      }
    );
  };
}

Tell.init = function(done) {
  return done();
}
