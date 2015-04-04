'use strict';

var express = require('express');
var router = express.Router();

var User = require('../../api/user/user.model');
var UserController = require('../../api/user/user.controller');
var Status = require('../../helper/const').STATUS_CODE;

router.post('/', function (req, res, next) {
  User.findById(req.body.token, function (err, user) {
    if (err) { 
      return next(err); 
    }
    if (!user) { 
      UserController.createUser(req, res);
    } else {
      res.status(Status.SUCCESS_OK).json({});
    }
  });
});

module.exports = router;
