'use strict';

var express = require('express');
var User = require('../../api/user/user.model');
var UserController = require('../../api/user/user.controller')
var router = express.Router();

router.post('/', function (req, res, next) {
  User.findById(req.body.token, function (err, user) {
    if (err) { 
      return next(err); 
    }
    if (!user) { 
      UserController.create(req, res);
    } else {
      res.status(200).json({});
    }
  });
});

module.exports = router;
