'use strict';

var PersonalController = function ($scope, MidifyApi, midis) {
  $scope.midis = midis;

  $scope.dateFormat = function (time) {
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    var date = new Date(time);
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ', ' + year;
  }

  $scope.durationFormat = function (duration) {
    var minutes = Math.floor(duration / 60);
    var seconds = duration - minutes * 60;
    return pad(minutes, 2) + ":" + pad(seconds, 2);
  }

  function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }
}

angular.module('Midify').controller('PersonalCtrl', PersonalController);
