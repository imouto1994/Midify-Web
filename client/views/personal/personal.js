'use strict';

angular.module('Midify')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/personal/:userId', {
        templateUrl: 'views/personal/personal.html',
        controller: 'PersonalCtrl',
        resolve: {
          midis: function ($route, MidifyApi) {
            return MidifyApi.getMidisFromUser($route.current.params.userId);
          }
        } 
      });
  });