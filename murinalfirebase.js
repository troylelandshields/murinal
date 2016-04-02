
"use strict";

(function() {
  window.angular.module("murinal")
    .factory("MurinalFirebase", ["$window", function($window) {
      
      //var ref = new $window.Firebase("https://murinal.firebaseio.com");
      return new $window.Firebase("https://murinal.firebaseio.com");
    }]);

})();