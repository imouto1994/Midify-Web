'use strict';

var mongoose = require('mongoose');
var q = require('q');

var Schema = mongoose.Schema;

/**
 * Schema Declaration
 */
var UserSchema = new Schema({
  // Token id
  _id: { type: String, required: true },
  // Facebook user id
  userId: { type: String, required: true }
});

/**
 * Virtual Variables
 */
UserSchema
  .virtual('token')
  .get(function () {
    return this._id;
  })
  .set(function (token) {
    this._id = token;
  })

/**
 * Methods
 */
UserSchema.statics = {
  createUser: function (user) {
    var deferred = q.defer();
    this.create(user, function (err, user) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(user);
      }
    });
    return deferred.promise;
  }
};

module.exports = mongoose.model('User', UserSchema);
