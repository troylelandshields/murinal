"use strict";

(function() {
  window.angular.module("murinal")
    .service("PlotDataSvc", ["$window", "$q", function($window, $q) {
    var getPlotData = function(plotName) {
      var deferred = $q.defer();

      setTimeout(function() {
        var data = $window.JSON.parse($window.localStorage.getItem(plotName));

        if (data) {
          deferred.resolve(data);
        }
        else {
          deferred.reject();
        }
      }, 0);

      return deferred.promise;
    };

    var storePlotData = function(plotName, data) {
      $window.localStorage.setItem(plotName, JSON.stringify(data));
    };

    return {
      getPlotData: getPlotData,
      storePlotData: storePlotData
    };
  }]);

})();