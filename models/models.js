var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.alarms = new Schema({
  channels: Array,
  days: Array,
  hour: Number,
  minute: Number,
  message: String,
});

exports.logs = new Schema({
  time: Date,
  channel: String,
  nick: String,
  message: String,
});

exports.tells = new Schema({
  from: String,
  to: String,
  tellTo: String,
  message: String,
});

