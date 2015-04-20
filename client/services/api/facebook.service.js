'use strict';

/*
  AUTHENTICATION SERVICE
 */
var FacebookApiService = function ($q, $http) {

  this.getFriends = function() {
    var deferred = $q.defer();

    $http.get('/api/facebook/friends')
      .success(
        function (data) {
          console.log("Successfully fetch user's friends");
          console.log(data);
          deferred.resolve(data);
          
        }
      ).error(
        function (err) {
          deferred.reject(err);
        }
      );

    return deferred.promise;
  }
};

angular.module('Midify').service('FacebookApi', FacebookApiService);

