'use strict';

angular.module('Midify')
  .directive('navBar', function ($mdDialog) {
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      templateUrl: 'directives/nav-bar/nav-bar.html',
      link: function($scope) {
        $scope.signIn = function(ev) {
          $mdDialog.show(
            {
              controller: SignInDialogController,
              templateUrl: 'directives/nav-bar/sign-in-dialog.html',
              targetEvent: ev
            }
          );
        };

        $scope.signUp = function(ev) {
          $mdDialog.show(
            {
              controller: SignUpDialogController,
              templateUrl: 'directives/nav-bar/sign-up-dialog.html',
              targetEvent: ev
            }
          );
        };

        function SignUpDialogController($scope, $mdDialog) {

        }

        function SignInDialogController($scope, $mdDialog) {

        }
      }
    };
  });
