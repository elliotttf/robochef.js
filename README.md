RoboChef now with more JavaScript.

To run this, first create a local.js file like so:

```
module.exports = {
  db: 'mongodb://localhost/robochef',
  port: 3001,
  irc: {
    server: 'irc.freenode.net',
    nick: 'RoboChef_js',
    channels: [
      '##robochef-test',
    ],
  },
};
```

Then run:

```
node app.js
```
