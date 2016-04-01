
"use strict";

(function() {
  window.angular.module("murinal")
    .service("ImagesSvc", ["$window", "$q", function($window, $q) {
      var getImage = function(plotName) {
        var deferred = $q.defer();

        setTimeout(function() {
          var imgData = $window.localStorage.getItem(plotName + "img");

          if (imgData) {
            deferred.resolve(imgData);
          }
          else {
            deferred.resolve(null);
          }
        }, 0);

        return deferred.promise;
      };

      var saveImage = function(plotName, imgData) {
        $window.localStorage.setItem(plotName + "img", imgData);
      };

      return {
        getImage: getImage,
        saveImage: saveImage
      };
    }]);

})();