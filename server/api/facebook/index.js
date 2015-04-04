'use strict';

var express = require('express');
var router = express.Router();
var FacebookController = require('./facebook.controller.js');
var Auth = require('../../auth/auth.service');

router.get('/me', Auth.isAuthenticated(), FacebookController.getMe);
router.get('/user', Auth.isAuthenticated(), FacebookController.getUser);
router.get('/friends', Auth.isAuthenticated(), FacebookController.getFriendList);

module.exports = router;
