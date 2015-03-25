'use strict';

var config = require('./config/environment');

module.exports = function (app) {

  // APIs
  app.use('/api/users', require('./api/user'));
  //app.use('/api/midi', require('./api/midi'));
  app.use('/api/facebook', require('./api/facebook'));

  // Auth
  app.use('/auth', require('./auth'));

  app.route('/:url(api|app|bower_components|assets)/*')
    .get(function (req, res) {
      res.status(404).end();
    });

  app.route('/*')
    .get(function (req, res) {
      res.sendFile(
        app.get('appPath') + '/index.html',
        { root: config.root }
      );
    });

};
