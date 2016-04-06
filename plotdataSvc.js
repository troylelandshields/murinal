"use strict";

(function() {
  window.angular.module("murinal")
    .service("PlotDataSvc", ["MurinalFirebase", "$q", "$timeout", function(MurinalFirebase, $q, $timeout) {

      var initPlotData = function(plotAddress) {
        return MurinalFirebase.child("plots").child(plotAddress.address).set({
          likesBalance: 0,
          murinal: "Murinal",
          x: plotAddress.x,
          y: plotAddress.y,
          currentPrice: 10
        })
      };

      var getPlotData = function(plotAddress) {
        var deferred = $q.defer();

        MurinalFirebase.child("plots").child(plotAddress.address).once("value", function(dataSnapshot) {
          if (!dataSnapshot.exists()) {
            initPlotData(plotAddress).then(function() {
              MurinalFirebase.child("plots").child(plotAddress.address).once("value", function(dataSnapshot) {
                deferred.resolve(dataSnapshot.val());
              });
            });
          }
          else {
            deferred.resolve(dataSnapshot.val());
          }
        }, function(err) {
          console.log(err);
        });

        return deferred.promise;
      };

      var listenToPlotData = function(plotAddress) {
        var deferred = $q.defer();

        MurinalFirebase.child("plots").child(plotAddress.address).on("value", function(dataSnapshot) {
          if (!dataSnapshot.exists()) {
            initPlotData(plotAddress);
          }
          else {
            $timeout(function() {
              deferred.notify(dataSnapshot.val());
            }, 0);
          }
        }, function(err) {
          console.log(err);
        });

        return deferred.promise;
      };

      return {
        getPlotData: getPlotData,
        listenToPlotData: listenToPlotData
      };
    }]);

})();