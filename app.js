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

/**
 * Plugins.
 */
app.use(flatiron.plugins.http);
app.use(require('./plugins/alarm'), client);
app.use(require('./plugins/log'), client);
app.use(require('./plugins/seen'), client);
app.use(require('./plugins/tell'), client);

/**
 * Global event handlers.
 */
client.on('join', function(channel, nick, message) {
  app.emit('join', { channel: channel, nick: nick, message: message });
});

client.on('message', function onMessage(from, to, message) {
  app.emit('message', { from: from, to: to, message: message, });
});

client.on('selfMessage', function onMessage(to, message) {
  app.emit('selfMessage', { to: to, message: message });
});

/**
 * Routes.
 */
app.router.get('/', function() {
  var index = require('./routes');
  index.send(this.res);
});

app.router.get('/log/:channel', function(channel) {
  console.log(channel);
  var log = require('./routes/viewLog');
  log.send(this.res, channel);
});

app.router.get('/log', function() {
  var log = require('./routes/log');
  log.send(this.res);
});

app.router.post('/say', function() {
  var say = require('./routes/say');
  say.send(this.req, this.res, client);
  });

app.start(settings.port);

