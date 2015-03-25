'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* User Schema */
var UserSchema = new Schema({
  _id: String,
  userId: String
});

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
UserSchema.methods = {
  
};

module.exports = mongoose.model('User', UserSchema);
