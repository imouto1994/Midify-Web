'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Schema Declaration
 */
var MidiSchema = new Schema({
  // ID of the MIDI track
  _id: String,
  // File Path of MIDI track
  filePath: String,
  // Duration of MIDI track
  duration: Number,
  // ID of user original owning this MIDI track
  ownerId: String,
  // ID of current user having this MIDI track
  currentId: String,
  // Reference ID of the MIDI track if it is a reference
  refId: String,
  // Indicator whether this track is public or private
  isPublic: Boolean,
  // Time created of this MIDI track
  time: Date
});

/**
 * Virtual variables
 */
MidiSchema
  .virtual('trackId')
  .get(function () {
    return this._id;
  })
  .set(function (trackId) {
    this._id = trackId;
  })

/**
 * Methods
 */
UserSchema.methods = {
  
};

module.exports = mongoose.model('Midi', UserSchema);
