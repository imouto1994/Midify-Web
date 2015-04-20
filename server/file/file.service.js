'use strict';

var exec = require('child_process').exec;

var compose = require('composable-middleware');
var multer = require('multer');
var Log = require('../helper/log');
var q = require('q');

module.exports = {
  /**
   * Attach the user object to the request if authenticated
   * Otherwise returns 403
   */
  uploadWav: function () {
    return compose()
      .use(
        multer({
          dest: __dirname + '/wavUploads/',
          rename: function (fieldName, fileName) {
            return fileName + Date.now();
          },
          onFileUploadStart: function (file) {
            Log.logInfo(file.originalname + ' is starting to being uploaded');
          },
          onFileUploadComplete: function (file) {
            Log.logSuccess(file.originalname + ' is uploaded to ' + file.path);
          }
        }
      )
    );
  },

  convertMidi: function (wavFilePath) {
    var deferred = q.defer();

    var processPath = __dirname + '/waon/waon';
    var inputPath = wavFilePath;
    var extenstionIndex = inputPath.lastIndexOf('wav');
    var outputPath = inputPath.substring(0, extenstionIndex) + "mid";
    var commandString = processPath + " -i " + inputPath + " -o " + outputPath;
    exec(commandString, function (error, stdout, stderr) {
      Log.logSuccess('stdout: ' + stdout);
      Log.logError('stderr: ' + stderr);
      if (error !== null) {
        Log.logError('exec error: ' + error);
        deferred.reject(error);
      } else {
        deferred.resolve(outputPath);
      }
    });

    return deferred.promise;
  }
};
