'use strict';

var q = require('q');

var Log = require('../../helper/log');
var Status = require('../../helper/const').STATUS_CODE;
var ActivityType = require('../../helper/const').ACTIVITY_TYPE;
var Activity = require('./activity.model');
var Facebook = require('../facebook/facebook.controller');

function _handleError (res, err) {
  Log.logError(err);
  return res.status(Status.SERVER_INTERNAL_ERROR).json({error: err});
}


exports.createActivityCreate = function (userId, fileName) {
  var deferred = q.defer();

  var newActivity = {
    activityType: ActivityType.ACTIVITY_CREATE_TYPE,
    userId: userId,
    targetUserId: userId,
    targetFileName: fileName
  };

  Activity.createActivity(newActivity).then(
    function (newActivity) {
      deferred.resolve(newActivity);
    },
    function (err) {
      _handleError(res, err);
    }
  );

  return deferred.promise;
};

exports.createActivityFork = function (userId, targetUserId, fileName) {
  var deferred = q.defer();

  var newActivity = {
    activityType: ActivityType.ACTIVITY_FORK_TYPE,
    userId: userId,
    targetUserId: targetUserId,
    targetFileName: fileName
  };

  Activity.createActivity(newActivity).then(
    function (newActivity) {
      deferred.resolve(newActivity);
    },
    function (err) {
      _handleError(res, err);
    }
  );

  return deferred.promise;
};

exports.createActivityPlay = function (userId, targetUserId, fileName) {
  var deferred = q.defer();

  var newActivity = {
    activityType: ActivityType.ACTIVITY_PLAY_TYPE,
    userId: userId,
    targetUserId: targetUserId,
    targetFileName: fileName
  };

  Activity.createActivity(newActivity).then(
    function (newActivity) {
      deferred.resolve(newActivity);
    },
    function (err) {
      _handleError(res, err);
    }
  );

  return deferred.promise;
};

exports.getActivitiesForUser = function (req, res) {

};