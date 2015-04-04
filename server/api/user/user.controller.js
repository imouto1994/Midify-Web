'use strict';

var q = require('q');

var Log = require('../../helper/log');
var User = require('./user.model');
var Status = require('../../helper/const').STATUS_CODE;

function _handleError (res, err) {
  Log.logError(err);
  return res.status(Status.SERVER_INTERNAL_ERROR).json({error: err});
}
 
/**
 * Creates a new user in the DB.
 *
 * @param req
 * @param res
 */
exports.createUser = function (req, res) {
  User.createUser(req.body).then(
    function (user) {
      res.status(Status.SUCCESS_CREATED).json({ user: user });
    }, 
    function (err) {
      _handleError (res, err)
    }
  );
};