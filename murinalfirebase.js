
"use strict";

(function() {
  window.angular.module("murinal")
    .factory("MurinalFirebase", ["$window", function($window) {
      
      //var ref = new $window.Firebase("https://murinal.firebaseio.com");
      var ref = new $window.Firebase("https://murinal.firebaseio.com");
      
      return ref;
    }]);

})();