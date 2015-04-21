'use strict';

var app = angular.module('Midify', 
  [ 'ngRoute', 
    'ngCookies', 
    'ngMaterial',
    'ngAnimate', 
    'facebook'
  ]);

/*
  FACEBOOK SDK CONFIGURATION
 */
var FACEBOOK_ID = '817233611663903'
app.config(function(FacebookProvider) {
  FacebookProvider.init({
    appId: FACEBOOK_ID,
    status: false
  });
});

/*
  ROUTE CONFIGURATION
 */
app.config(function ($routeProvider, $locationProvider, $httpProvider) {
  $routeProvider
    .otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);
  $httpProvider.interceptors.push('authInterceptor');
});

/*
  MATERIAL THEME CONFIGURATION
 */
app.config(function ($mdThemingProvider) {
  var defaultTheme = $mdThemingProvider.theme('default');

  // Primary Scheme
  defaultTheme.primaryPalette('red', {
    'default': '500',
    'hue-1': 'A200',
    'hue-2': 'A400',
    'hue-3': '200'
  });

  // Accent Scheme
  defaultTheme.accentPalette('blue', {
    'default': '500',
    'hue-1': '700',
    'hue-2': '800',
    'hue-3': '900'
  });

  // Warn Scheme 
  
});

/** 
 * AUTHENTICATION INTERCEPTOR
 */
app.factory('authInterceptor',
  function ($rootScope, $q, $cookieStore, $location) {
    return {
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = $cookieStore.get('token');
        }
        return config;
      },

      responseError: function (response) {
        if (response.status === 401) {
          $location.path('/');
          $cookieStore.remove('token');
          $cookieStore.remove('userId');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }

    };
  }
);

/*
  RUN CONFIGURATION
 */
app.run(function ($rootScope, Auth) {
  $rootScope.Auth = Auth;
  $rootScope.Auth.checkValidAuthentication();
});
