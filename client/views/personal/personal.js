'use strict';

angular.module('Midify')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/personal/:userId', {
        templateUrl: 'views/personal/personal.html',
        controller: 'PersonalCtrl'
      });
  });