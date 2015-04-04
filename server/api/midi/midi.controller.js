'use strict';

var q = require('q');

var Log = require('../../helper/log');
var Status = require('../../helper/const').STATUS_CODE;
var Midi = require('./midi.model');
var Facebook = require('../facebook/facebook.controller');

function _handleError (res, err) {
  Log.logError(err);
  return res.status(Status.SERVER_INTERNAL_ERROR).json({error: err});
}

/**
 * Upload the created MIDI track
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.uploadMidi = function (req, res) {
  if (!req.files) {
    var err = 'Failed to upload the MIDI track';
    _handleError(res, err);
  } else {
    var newMidi = {
      ownerId: req.user.userId,
      userId: req.user.userId,
      filePath: req.files.userMidi.path,
      duration: req.midi.duration,
      title: req.midi.title,
      description: req.midi.description
    };
    Midi.createMidi(newMidi).then(
      function (midi) {
        Log.logSuccess("MIDI file has been created successfully!");
        res.status(Status.SUCCESS_CREATED).json({midi: midi});
      },  
      function (err) {
        _handleError(res, err);
      }
    );
  }
}

/**
 * [downloadMidi description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.downloadMidi = function (req, res) {
  var trackId = req.body.trackId;
  var userId = req.user.userId;
  if (!trackId) {
    var err = 'Failed to receive the ID of MIDI track';
    _handleError(res, err);
  } else {
    Midi.findMidiById(trackId).then(
      function (midi) {
        if (!midi.filePath) {
          var err = "No file path for the provided track";
          _handleError(res, err);
        } else if (midi.currentId != userId) {
          var err = "User is not allowed to download the MIDI not belonging to him";
          _handleError(res, err);
        } else {
          res.download(midiFilePath, function (err) {
            if (err) {
              _handleError(res, err);
            } else {
              Log.logSuccess('File has been sent successfully');
            }
          });
        }
      }, 
      function (err) {
        _handleError(res, err);
      }
    )
  }
}

/**
 * [forkMidi description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.forkMidi = function (req, res) {
  var trackId = req.body.trackId;
  if (!trackId) {
    var err = 'Failed to receive the ID of MIDI track';
    _handleError(res, err);
  } else {
    Midi.findMidiById(trackId).then(
      function (midi) {
        if (!midi) {
          var err = "No midi track for the provided ID";
          _handleError(res, err);
        } else if (!midi.isPublic) {
          var err = 'Cannot fork a private MIDI';
          _handleError(res, err);
        } else if (midi.ownerId == req.user.userId) {
          var err = "Cannot fork user's own MIDI track";
          _handleError(res, err);
        } else {
          var newMidi = {
            refId: (midi.refId == '') ? midi.trackId : midi.refId,
            ownerId: midi.ownerId,
            userId: req.user.userId,
            filePath: midi.filePath,
            duration: midi.duration,
            title: midi.title,
            description: midi.description
          };
          Midi.createMidi(newMidi);
        }
      },
      function (err) {
        _handleError(res, err);
      }
    ).then(
      function (midi) {
        Log.logSuccess("MIDI file has been created successfully!");
        res.status(Status.SUCCESS_CREATED).json({midi: midi});
      },
      function (err) {
        _handleError(res, err);
      }
    )
  }
};

/**
 * [deleteMidi description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.deleteMidi = function (req, res) {
  var userId = req.user.userId;
  var trackId = req.body.trackId;
  
  Midi.findMidiById(trackId).then(
    function (midi) {
      if (!midi) {
        var err = "No MIDI track for the provided ID";
        _handleError(res, err);
      } else if (midi.userId != userId) {
        var err = "User is not allowed the MIDI not belonging to him";
        _handleError(res, err);
      } else if (midi.ownerId == userId) {
        Midi.deleteMidiRefs(trackId);
      } else {
        Midi.deleteMidi(trackId);
      }
    },
    function (err) {
      _handleError(res, err);
    }
  ).then(
    function (msg) {
      Log.logSuccess(msg);
      res.status(Status.SUCCESS_OK).json({});
    },
    function (err) {
      _handleError(res, err);
    }
  );
};

/**
 * [getMidi description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getMidi = function (req, res) {
  var userId = req.user.userId;
  var trackId = req.body.trackId;
  var friendIds = [];

  Facebook.getFriends(req, res).then(
    function (friends) {
      for (var friend in friends) {
        friendIds.push(friend.id);
      }
      Midi.findMidiByUser(trackId);
    },
    function (err) {
      _handleError(res, err);
    }
  ).then(
    function (midi) {
      if (!midi) {
        var err = "No MIDI track for the provided ID";
        _handleError(res, err);
      } else if (midi.currentId != userId && friendIds.indexOf(midi.currentId) == -1) {
        var err = "User is not allowed to get the MIDI not belonging to him";
        _handleError(res, err);
      } else {
        Log.logSuccess("Receive the required MIDI track successfully");
        res.status(Status.SUCCESS_OK).json({midi: midi});
      }
    },  
    function (err) {
      _handleError(res, err);
    }
  );
};

/**
 * [getMidiFromUser description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getMidiFromUser = function (req, res) {
  var userId = req.user.userId;
  var targetUserId = req.body.targetUserId;
  var friendIds = [];

  Facebook.getFriends(req, res).then(
    function (friends) {
      for (var friend in friends) {
        friendIds.push(friend.id);
      }
      if (friendIds.indexOf(targetUserId) == -1) {
        var err = "Cannot get MIDIs from users who are not your friend";
        _handleError(res, err);
      } else {
        var isRequestUser = targetUserId == userId;
        Midi.findMidiByUser(targetUserId, isRequestUser);
      }
    },
    function (err) {
      _handleError(res, err);
    }
  ).then(
    function (midis) {
      res.status(200).json(midis);
    },
    function (err) {
      _handleError(res, err);
    }
  );
};