'use strict';

var compose = require('composable-middleware');

var User = require('../api/user/user.model');
var FacebookApi = require('../api/facebook/facebook.controller');
var Status = require('../helper/const').STATUS_CODE;

module.exports = {
  /**
   * Attach the user object to the request if authenticated
   * Otherwise returns 403
   */
  isAuthenticated: function () {
    return compose()
        .use(function (req, res, next) {
          var token = req.headers['authorization'];
          User.findById(token, function (err, user) {
            if (err) { 
              return next(err); 
            }
            if (!user) { 
              return res.status(Status.CLIENT_UNAUTHORIZED).json({err: "There is no such user"}); 
            }
            req.user = user;
            next();
          });
        });
  }
};
