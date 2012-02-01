var flatiron = require('flatiron');
var path = require('path');
var app = flatiron.app;
var irc = require('irc');
var mongoose = require('mongoose');

var settings = require('./local.js');

mongoose.connect(settings.db);

var client = new irc.Client(
  settings.irc.server,
  settings.irc.nick,
  {
    channels: settings.irc.channels,
  }
);

app.use(flatiron.plugins.http);
app.use(require('./plugins/alarm'), client);
app.use(require('./plugins/log'));
app.use(require('./plugins/tell'), client);

client.on('message', function onMessage(from, to, message) {
  app.message(from, to, message);
});

app.router.get('/', function() {
  var index = require('./routes');
  index.send(this.res);
});

app.router.get('/log', function() {
  var log = require('./routes/log');
  log.send(this.res);
});

app.router.get('/log/:channel', function(channel) {
  var log = require('./routes/viewLog');
  viewLog.send(this.res, channel);
});

app.start(settings.port);

