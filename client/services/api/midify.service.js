'use strict';

/*
  AUTHENTICATION SERVICE
 */
var MidifyApiService = function ($q, $http) {

  this.getMidisFromUser = function(userId) {
    var deferred = $q.defer();

    $http.get('/api/midi/user', {
      params: {
        userId: userId
      }
    }).success(
      function (midis) {
        console.log("Successfully fetch user's friends");
        console.log(midis);
        deferred.resolve(midis);
      }
    ).error(
      function (err) {
        deferred.reject(err);
      }
    );

    return deferred.promise;
  };

  this.downloadMidi = function(fileId) {
    var deferred = $q.defer();

    $http.get('/api/midi/download', {
      params: {
        fileId: fileId
      }
    }).success(
      function (res) {
        deferred.resolve(res);
      }
    ).error(
      function (err) {
        deferred.reject(err);
      }
    );

    return deferred.promise;
  };
};

angular.module('Midify').service('MidifyApi', MidifyApiService);

