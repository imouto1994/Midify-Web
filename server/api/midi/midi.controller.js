'use strict';

var q = require('q');

var Log = require('../../helper/log');
var Status = require('../../helper/const').STATUS_CODE;
var Midi = require('./midi.model');
var ActivityController = require('../activity/activity.controller');
var Facebook = require('../facebook/facebook.controller');
var File = require('../../file/file.service');

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
exports.convertMidi = function (req, res) {
  if (!req.files) {
    var err = 'Failed to upload the MIDI track';
    _handleError(res, err);
  } else {
    var newMidi;
    File.convertMidi(req.files.wav.path).then(
      function (midiFilePath) {
        var newMidi = {
          ownerId: req.user.userId,
          userId: req.user.userId,
          filePath: midiFilePath,
          wavFilePath: req.files.wav.path,
          duration: req.body.duration,
          title: req.body.title,
          isPublic: req.body.isPublic
        };
        Log.logJSONInfo(newMidi);
        return Midi.createMidi(newMidi);
      },
      function (err) {
        _handleError(res, err);  
      }
    ).then(
      function (midi) {
        Log.logSuccess("MIDI file has been created successfully!");
        Log.logJSONInfo(midi);
        newMidi = midi;
        Log.logInfo("Create corresponding activity...");
        return ActivityController.createActivityCreate(req.user.userId, req.body.title);
      },  
      function (err) {
        _handleError(res, err);
      }
    ).then(
      function (createActivity) {
        if (createActivity) {
          res.status(Status.SUCCESS_OK).json(newMidi);
        } else {
          _handleError(res, "The create activity is null");
        }
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
  var fileId = req.param('fileId');
  if (!fileId) {
    var err = 'Failed to receive the ID of MIDI track';
    _handleError(res, err);
  } else {
    Midi.findMidiById(fileId).then(
      function (midi) {
        if (!midi.filePath) {
          var err = "No file path for the provided track";
          _handleError(res, err);
        } else {
          res.download(midi.filePath, function (err) {
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
};

exports.downloadMidiForRemotePlay = function (req, res) {
  var fileId = req.param('fileId');
  var userId = req.user.userId;
  if (!fileId) {
    var err = 'Failed to receive the ID of MIDI track';
    _handleError(res, err);
  } else {
    var downloadMidi;
    Midi.findMidiById(fileId).then(
      function (midi) {
        if (!midi.filePath) {
          var err = "No file path for the provided track";
          _handleError(res, err);
        } else {
          downloadMidi = midi;
          return ActivityController.createActivityPlay(userId, 
                                                        midi.ownerId, 
                                                        midi.title);
        }
      }, 
      function (err) {
        _handleError(res, err);
      }
    ).then(
      function (playActivity) {
        if (playActivity) {
          res.download(downloadMidi.filePath, function (err) {
            if (err) {
              _handleError(res, err);
            } else {
              Log.logSuccess('File has been sent successfully');
            }
          });  
        } else {
          _handleError(res, "Play Activity is null");
        }
      }, 
      function (err) {
        _handleError(res, err);
      }
    );
  }
};

/**
 * [forkMidi description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.forkMidi = function (req, res) {
  var userId = req.user.userId;
  var fileId = req.body._id;
  if (!fileId) {
    var err = 'Failed to receive the ID of MIDI track';
    _handleError(res, err);
  } else {
    var refMidi;
    var newMidi;
    Midi.findMidiById(fileId).then(
      function (midi) {
        refMidi = midi;
        if (!midi) {
          var err = "No midi track for the provided ID";
          _handleError(res, err);
        } else if (!midi.isPublic) {
          var err = 'Cannot fork a private tracl';
          _handleError(res, err);
        } else if (midi.ownerId == userId) {
          var err = "Cannot fork user's own track";
          _handleError(res, err);
        } else if (midi.userId == userId) {
          var err = "Cannot fork user's already forked track";
          _handleError(res, err);
        } else if (midi.refId) {
          var err = "Cannot fork an unoriginal track";
          _handleError(res, err);
        } else {
          Midi.findMidiByRefForUser(fileId, userId);
        }
      },
      function (err) {
        _handleError(res, err);
      }
    ).then(
      function (duplicateMidi) {
        if (duplicateMidi) {
          var err = "Cannot fork user's already forked track";
          _handleError(res, err);
        } else {
          var midi = {
            refId: refMidi._id,
            ownerId: refMidi.ownerId,
            userId: req.user.userId,
            filePath: refMidi.filePath,
            wavFilePath: refMidi.wavFilePath,
            duration: refMidi.duration,
            title: refMidi.title,
            isPublic: refMidi.isPublic
          };
          return Midi.createMidi(midi);
        }
      },
      function (err) {
        _handleError(res, err);
      }
    ).then(
      function (midi) {
        Log.logSuccess("MIDI file has been created successfully!");
        Log.logJSONInfo(midi);
        newMidi = midi;
        return ActivityController.createActivityFork(req.user.userId, 
                                                refMidi.ownerId, 
                                                refMidi.title);
      },
      function (err) {
        _handleError(res, err);
      }
    ).then(
      function (forkActivity) {
        if (forkActivity) {
          res.status(Status.SUCCESS_CREATED).json(newMidi);
        } else {
          _handleError(res, "Fork Activity is null");
        }
      },
      function (err) {
        _handleError(res, err);
      }
    );
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
  var fileId = req.param('fileId');
  
  Midi.findMidiById(fileId).then(
    function (midi) {
      if (!midi) {
        var err = "No MIDI track for the provided ID";
        _handleError(res, err);
      } else if (midi.userId != userId) {
        var err = "User is not allowed the MIDI not belonging to him";
        _handleError(res, err);
      } else {
        Midi.deleteMidi(fileId);
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
  var fileId = req.param('fileId');
  var friendIds = [];

  Facebook.getFriends(req, res).then(
    function (friends) {
      for (var friend in friends) {
        friendIds.push(friend.id);
      }
      Midi.findMidiByUser(fileId);
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
        res.status(Status.SUCCESS_OK).json(midi);
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
  var targetUserId = req.param('userId');
  var friendIds = [];
  Facebook.getFriends(req, res).then(
    function (friends) {
      for (var index in friends) {
        friendIds.push(friends[index].id);
      }
      if (targetUserId != userId && friendIds.indexOf(targetUserId) == -1) {
        var err = "Cannot get MIDIs from users who are not your friend";
        _handleError(res, err);
      } else {
        var isRequestUser = targetUserId == userId;
        return Midi.findMidiByUser(targetUserId, isRequestUser);
      }
    },
    function (err) {
      _handleError(res, err);
    }
  ).then(
    function (midis) {
      Log.logJSONInfo(midis);
      res.status(200).json(midis);
    },
    function (err) {
      _handleError(res, err);
    }
  );
};