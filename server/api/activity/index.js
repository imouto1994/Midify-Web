'use strict';

var router = require('express').Router();

var ActivityController = require('./activity.controller');
var AuthCheck = require('../../auth/auth.service').isAuthenticated();

// GET REQUEST
router.get('/user', AuthCheck, ActivityController.getActivitiesForUser);

module.exports = router;
