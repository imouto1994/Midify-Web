'use strict';

var compose = require('composable-middleware');
var multer = require('multer');
var Log = require('../helper/log');

module.exports = {
  /**
   * Attach the user object to the request if authenticated
   * Otherwise returns 403
   */
  uploadMidi: function () {
    return compose()
      .use(
        multer({
          dest: __dirname + '/midiUploads/',
          rename: function (fieldName, fileName) {
            return fileName;
          },
          onFileUploadStart: function (file) {
            Log.logMessage(file.originalname + ' is starting to being uploaded');
          },
          onFileUploadComplete: function (file) {
            Log.logSuccess(file.originalname + ' is uploaded to ' + file.path);
          }
        }
      )
    );
  }
};
