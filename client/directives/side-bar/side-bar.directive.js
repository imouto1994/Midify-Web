'use strict';

angular.module('Midify')
  .directive('sideBar', function (FacebookApi, $cookieStore, $location) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'directives/side-bar/side-bar.html',
      link: function ($scope) {
        // Me User
        $scope.me = {};
        // List of friends
        $scope.friends = [];

        $scope.refreshList = function () {
          $scope.getMe();
          $scope.getFriends();
        };
        
        $scope.getMe = function () {
          $scope.me = {
            userId: $cookieStore.get('userId'),
            name: $cookieStore.get('userName')
          };
        };

        // Retrieve list of friends
        $scope.getFriends = function () {
          $scope.friends = [];
          FacebookApi.getFriends().then(
            function (friends) {
              $scope.friends = friends;
            }
          )
        };

        $scope.onClick = function (ev, userId) {
          $location.path('/personal/' + userId);
        }
      }
    };
  });
