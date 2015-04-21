'use strict';

var HomeController = function ($scope, $routeParams, Auth) {
  $scope.signIn = function (ev) {
    $scope.Auth.login();
  }
}

angular.module('Midify').controller('HomeCtrl', HomeController);
