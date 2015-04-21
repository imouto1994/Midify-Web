'use strict';

angular.module('Midify')
  .directive('sideBar', function (FacebookApi, $cookieStore, $location) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'directives/side-bar/side-bar.html',
      link: function($scope) {
        // Current user
        $scope.me = {
          userId: $cookieStore.get('userId'),
          name: $cookieStore.get('userName')
        };
        // List of friends
        $scope.friends = [];

        // Retrieve list of friends
        $scope.getFriends = function() {
          $scope.friends = [];
          FacebookApi.getFriends().then(
            function (friends) {
              $scope.friends = friends;
            }
          )
        };

        $scope.onClick = function(ev, userId) {
          $location.path('/personal/' + userId);
        }
      }
    };
  });
