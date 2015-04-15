'use strict';

var mongoose = require('mongoose');
var q = require('q');

var Log = require('../../helper/log');

var Schema = mongoose.Schema;

/**
 * Schema Declaration
 */
var MidiSchema = new Schema({
  // Reference ID of the MIDI track if it is a reference
  refId: { type: String, default: ''},
  // ID of user original owning this MIDI track
  ownerId: { type: String, required: true },
  // ID of current user having this MIDI track
  userId: { type: String, required: true },
  // File Path of MIDI track
  filePath: { type: String, required: true },
  // Title of MIDI track
  title: { type: String, required: true },
  // Indicator whether this track is public or private
  isPublic: { type: Boolean, default: true },
  // Time created of this MIDI track
  editedTime: { type: Date, default: Date.now }
}, { versionKey: false });

var INVALID_UPDATE_FIELDS = [
  'refId',
  'ownerId',
  'userId',
  'trackId',
  'filePath'
];

/** 
 * Private methods
 */
function _checkValidFieldForUpdate (fieldName) {
  return INVALID_UPDATE_FIELDS.indexOf(fieldName) == -1;
}

/**
 * Methods
 */
MidiSchema.statics = {
  /**
   * [createMidi description]
   * @param  {Object} midi [Midi Track to be created]
   * @return {Promise}      [Promise for handle]
   */
  createMidi: function (midi) {
    var deferred = q.defer();
    Log.logInfo("Creating midi...");
    this.create(midi, function (err, midi) {
      if (err) {
        deferred.reject(err);
      } else {
        Log.logSuccess("Creating MIDI successfully");
        deferred.resolve(midi);
      }
    });

    return deferred.promise;
  },

  /**
   * [deleteMidi description]
   * @param  {[type]} midiId [description]
   * @return {[type]}        [description]
   */
  deleteMidi: function (midiId) {
    var deferred = q.defer();
    this.findByIdAndRemove(midiId, function (err) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve("Delete the track ID successfully");
      }
    });

    return deferred.promise;
  },

  deleteMidiRefs: function (midiId) {
    var deferred = q.defer();
    this.remove({refId: midiId}, function (err) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve("Delete all references of track ID successfully");
      }
    });

    return deferred.promise;
  },

  findMidiById: function (midiId) {
    var deferred = q.defer();
    this.findById(midiId, function (err, midi) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(midi);
      }
    });

    return deferred.promise;
  },

  findMidiByUser: function (userId, isRequestUser) {
    var deferred = q.defer();
    var conditions = {userId: userId};
    if (!isRequestUser) {
      conditions.isPublic = true;
    }
    this.find(conditions, function (err, midis) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(midis);
      }
    });

    return deferred.promise;
  },

  // TODO: To handle when all references and the midi itself are deleted
  deleteMidiFile: function (filePath) {

  }
}

module.exports = mongoose.model('Midi', MidiSchema);