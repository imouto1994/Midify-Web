'use strict';

/*
  AUTHENTICATION SERVICE
 */
var AuthService = function ($q, $http, $cookieStore, $location, Facebook) {
  var _user = {};

  /**
   * Login Action
   */
  this.facebookLogin = function () {
    var deferred = $q.defer();
    var self = this;

    Facebook.login(
      function (response) {
        if (response.authResponse) {
          console.log('User has been logged in successfully.');
          var user = {
            token: response.authResponse.accessToken,
            userId: response.authResponse.userID
          };
          $cookieStore.put("token", user.token);
          $cookieStore.put("userId", user.userId);
          deferred.resolve(user);
        } else {
          console.log('User has been logged in unsuccessfully ! :(');
          deferred.reject();
        }
      }
    , {scope: 'email,public_profile,user_friends'});

    return deferred.promise;
  };

  this.login = function() {
    var self = this;

    this.facebookLogin().then(
      function(user) {
        $http.post('/api/users', user).then(
          function (data, status) {
            console.log(data.status + ': User token has been registered successfully');
            $location.path('/personal/' + user.userId);
            self.fetchUserInfo();
          }
        );
      }
    );
  }


  /**
   * Logout
   */
  this.logout = function () {
    $cookieStore.remove('token');
    $cookieStore.remove('userId');
  };

  /**
   * Check authentication validity
   */
  this.checkValidAuthentication = function () {
    var self = this;

    self.fetchLoginStatus().then(
      function (user) {
        $http.post('/auth/facebook', user).then(
          function (data) {
            if (data.status == 200) {
              console.log('Token has already been registered');
            } else if (data.status == 201) {
              console.log('Token has been created');
            }
            $location.path('/personal/' + user.userId);
            self.fetchUserInfo();
          }
        )
      }
    );
  }

  /**
   * Retrieve login status 
   */
  this.fetchLoginStatus = function (useCookie) {
    useCookie = useCookie || true;
    var deferred = $q.defer();
    var self = this;

    if (useCookie && $cookieStore.get('token') && $cookieStore.get('userId')) {
      deferred.resolve({
        token: $cookieStore.get('token'),
        userId: $cookieStore.get('userId')
      })
    } else {
      Facebook.getLoginStatus(function (response) {
        if (response.status == 'connected') {
          console.log('User is currently logged in and successfully retrieve user authentication info');
          var user = {
            token: response.authResponse.accessToken,
            userId: response.authResponse.userID
          };
          $cookieStore.put("token", user.token);
          $cookieStore.put("userId", user.userId);
          deferred.resolve(user);
        } else if (response.status == 'not authorized') {
          console.log('User has not been authorized for the application');
        } else {
          console.log('User has not been logged into Facebook');
        }
      });
    }
    
    return deferred.promise;
  }

  /**
   * Fetch user information
   */
  this.fetchUserInfo = function() {
    $http.get('/api/facebook/me').then(
      function (user) {
        console.log("Successfully fetch user information");
        _user = user;
      },
      function (err) {
        console.log("Error: " + err);
      });
  }


  /**
   * Check if user is logged
   *
   */
  this.isLogged = function () {
    return typeof _user.id != 'undefined'
  };

  /**
   * Returns the user
   *
   */
  this.getUser = function () {
    return _user;
  };
};

angular.module('Midify').service('Auth', AuthService);

