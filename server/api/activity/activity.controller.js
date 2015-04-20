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
      deferred.reject(err);
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
      deferred.reject(err);
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
      deferred.reject(err);
    }
  );

  return deferred.promise;
};

exports.getActivitiesForUser = function (req, res) {
  var userId = req.user.userId;
  var friendIds = [];
  var friendNamesMap = {};
  Facebook.getFriends(req, res).then(
    function (friends) {
      for (var index in friends) {
        friendIds.push(friends[index].id);
        friendNamesMap[friends[index].id] = friends[index].name; 
      }
      return Activity.getActivitiesFromUsers(0, friendIds);
    },
    function (err) {
      _handleError(res, err);
    }
  ).then(
    function (activities) {
      for (var i = 0; i < activities.length; i++) {
        activities[i] = activities[i].toObject();
        var userName = friendNamesMap[activities[i].userId];
        var targetUserName = friendNamesMap[activities[i].targetUserId];
        activities[i].userName = userName;
        activities[i].targetUserName = targetUserName;
      }
      res.status(200).json(activities);
    },
    function (err) {
      _handleError(res, err);
    }
  );
};