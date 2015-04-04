'use strict';

var express = require('express');
var router = express.Router();
var UserController = require('./user.controller');

router.post('/', UserController.createUser);

module.exports = router;
