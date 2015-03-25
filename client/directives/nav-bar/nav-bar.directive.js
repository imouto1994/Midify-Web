'use strict';

angular.module('Midify')
  .directive('navBar', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'directives/nav-bar/nav-bar.html',
      link: function($scope) {
        $scope.signIn = function(ev) {
          $scope.Auth.login();
        };
      }
    };
  });
