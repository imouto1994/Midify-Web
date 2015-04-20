'use strict';

var router = require('express').Router();

var MidiController = require('./midi.controller');
var AuthCheck = require('../../auth/auth.service').isAuthenticated();
var WavUpload = require('../../file/file.service').uploadWav();

// POST REQUEST
router.post('/fork', AuthCheck, MidiController.forkMidi);
router.post('/convert', AuthCheck, WavUpload, MidiController.convertMidi);
router.get('/download', AuthCheck, MidiController.downloadMidi);
router.get('/remotePlay', AuthCheck, MidiController.downloadMidiForRemotePlay);

// DELETE REQUEST
router.delete('/', AuthCheck, MidiController.deleteMidi);

// GET REQUEST
router.get('/', AuthCheck, MidiController.getMidi);
router.get('/user', AuthCheck, MidiController.getMidiFromUser);

module.exports = router;
