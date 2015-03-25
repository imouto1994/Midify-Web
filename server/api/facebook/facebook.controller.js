'use strict';

var fbgraph = require('fbgraph');
var chalk = require('chalk');

/* Set Application Secret For Security */
var FACEBOOK_APP_SECRET = '5c0455324efff8a5440ae50f81a8b4fd';
fbgraph.setAppSecret(FACEBOOK_APP_SECRET);

/**
 * Creates a new user in the DB.
 *
 * @param req
 * @param res
 */
exports.getMe = function (req, res) {
  fbgraph.setAccessToken(req.user.token);
  fbgraph.get('/' + req.user.userId, function (err, response) {
    if (err) {
      console.log(chalk.red(err))
      res.status(500).json({error: err});
    } else {
      res.status(200).json(response);
    }
  })
};