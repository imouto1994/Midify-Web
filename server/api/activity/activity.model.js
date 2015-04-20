'use strict';

var mongoose = require('mongoose');
var q = require('q');

var Log = require('../../helper/log');
var ActivityType = require('../../helper/const').ACTIVITY_TYPE;

var Schema = mongoose.Schema;

/**
 * Schema Declaration
 */
var ActivitySchema = new Schema({
  // Type of activity
  activityType: {
    type: String, 
    required: true, 
    enum: [
      ActivityType.ACTIVITY_CREATE_TYPE, 
      ActivityType.ACTIVITY_FORK_TYPE, 
      ActivityType.ACTIVITY_PLAY_TYPE
    ]
  },
  // Reference ID of the MIDI track if it is a reference
  userId: { type: String, required: true },
  // Optional target User ID
  targetUserId: { type: String },
  // Optional target file name
  targetFileName: { type: String },
  // Time this activity occured
  createdTime: { type: Date, default: Date.now }
}, { versionKey: false });

/**
 * Methods
 */
ActivitySchema.statics = {
  /**
   * [createActivity description]
   * @param  {[type]} activity [description]
   * @return {[type]}          [description]
   */
  createActivity: function (activity) {
    var deferred = q.defer();
    Log.logInfo("Creating activity...");
    this.create(activity, function (err, activity) {
      if (err) {
        deferred.reject(err);
      } else {
        Log.logSuccess("Creating activity successfully");
        deferred.resolve(activity);
      }
    });

    return deferred.promise;
  },

  getActivitiesFromUsers: function (tick, userIds) {
    var deferred = q.defer();
    var conditions = {
      userId: {$in: userIds}
    };
    var options = {
      sort: {createdTime: -1},
      skip: tick * 20,
      limit: 20
    }
    this.find(conditions, options, function (err, activities) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(activities);
      }
    });

    return deferred.promise;
  }
};

module.exports = mongoose.model('Activity', ActivitySchema);