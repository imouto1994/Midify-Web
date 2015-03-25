'use strict';

var config = require('../../config/environment');
var chalk = require('chalk');
var User = require('./user.model');

function handleError (res, err) {
  console.log(chalk.red(err));
  return res.status(500).json({error: err});
}

/**
 * Creates a new user in the DB.
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  User.create(req.body, function (err, user) {
    if (err) { 
      return handleError(res, err); 
    }
    res.status(201).json({ user: user });
  });
};