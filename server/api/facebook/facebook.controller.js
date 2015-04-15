'use strict';

var fbgraph = require('fbgraph');
var q = require('q');

var Log = require('../../helper/log');
var Status = require('../../helper/const').STATUS_CODE;

/* Set Application Secret For Security */
var FACEBOOK_APP_SECRET = '5c0455324efff8a5440ae50f81a8b4fd';
fbgraph.setAppSecret(FACEBOOK_APP_SECRET);

/**
 * [Retrieve the profile of me]
 * @param  req [Request from client which must pass the authentication middleware]
 * @param  res [Return the profile of me]
 */
exports.getMe = function (req, res) {
  fbgraph.setAccessToken(req.user.token);
  var userId = req.user.userId;
  fbgraph.get('/' + userId, function (err, response) {
    if (err) {
      Log.logJSONError(err);
      res.status(Status.SERVER_INTERNAL_ERROR).json({error: err});
    } else {
      res.json(response);
    }
  });
};

/**
 * [Retrieve the profile of specified user]
 * @param  req [Request from client which must have the ID of specified user in params]
 * @param  res [Return the profile of specified user]
 */
exports.getUser = function (req, res) {
  fbgraph.setAccessToken(req.user.token);
  var userId = req.param('userId');

  fbgraph.get('/' + userId, function (err, response) {
    if (err) {
      Log.logJSONError(err);
      res.status(Status.SERVER_INTERNAL_ERROR).json({error: err});
    } else {
      res.status(Status.SUCCESS_OK).json(response.data);
    }
  });
};

/**
 * [Retrieve the list of friends who are also using this application]
 * @param  req [Request from client which must pass the authentication middleware]
 * @param  res [Return the profiles of friends using this application]
 */
exports.getFriends = function (req, res) {
  var deferred = q.defer();
  var userId = req.user.userId;

  fbgraph.setAccessToken(req.user.token);
  fbgraph.get('/' + userId + '/friends', function (err, response) {
    if (err) {
      Log.logJSONError(err);
      deferred.reject(err);
    } else {
      deferred.resolve(response.data);
    }
  });

  return deferred.promise;
};

exports.getFriendList = function (req, res) {
  module.exports.getFriends(req, res).then(
    function (friends) {
      var friendList = [];
      for (var i = 0; i < friends.length; i++) {
        var friend = friends[i];
        friendList.push({
          userId: friend.id,
          name: friend.name
        });
      }
      res.status(Status.SUCCESS_OK).json(friendList);
    },
    function (err) {
      res.status(Status.SERVER_INTERNAL_ERROR).json({error: err});
    }
  )
}

