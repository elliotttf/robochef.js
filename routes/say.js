/**
 * @fileoverview Accept post to allow sending arbitrary messages.
 */

var Say = exports;

Say.send = function(req, res, client) {
 if (typeof req.body.channels === 'undefined') {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unknown channels.' }));
    return;
  }
  else if (typeof req.body.message === 'undefined') {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unknown message.' }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'received' }));

  for (var x = 0; x < req.body.channels.length; x++) {
    client.say(req.body.channels[x], req.body.message);
  }
};

