'use strict';

var compose = require('composable-middleware');
var User = require('../api/user/user.model');
var FacebookApi = require('../api/facebook/facebook.controller');
var chalk = require('chalk');

module.exports = {
  /**
   * Attach the user object to the request if authenticated
   * Otherwise returns 403
   */
  isAuthenticated: function (req, res, next) {
    var token = req.headers['authorization'];
    User.findById(token, function (err, user) {
      if (err) { 
        return next(err); 
      }
      if (!user) { 
        return res.status(401).json({err: "There is no such user"}); 
      }
      req.user = user;
      next();
    });
  }
};
