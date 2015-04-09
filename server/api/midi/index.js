'use strict';

var router = require('express').Router();

var MidiController = require('./midi.controller');
var AuthCheck = require('../../auth/auth.service').isAuthenticated();
var MidiUpload = require('../../file/file.service').uploadMidi();

// POST REQUEST
router.post('/fork', AuthCheck, MidiController.forkMidi);
router.post('/upload', AuthCheck, MidiUpload, MidiController.uploadMidi);

// DELETE REQUEST
router.delete('/', AuthCheck, MidiController.deleteMidi);

// GET REQUEST
router.get('/', AuthCheck, MidiController.getMidi);
router.get('/user/', AuthCheck, MidiController.getMidiFromUser);

module.exports = router;
