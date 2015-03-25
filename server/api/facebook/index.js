'use strict';

var express = require('express');
var router = express.Router();
var facebookApi = require('./facebook.controller.js');
var auth = require('../../auth/auth.service');

router.get('/me', auth.isAuthenticated, facebookApi.getMe);

module.exports = router;
