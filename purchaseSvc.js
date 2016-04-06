"use strict";

(function() {
  window.angular.module("murinal")
    .service("PurchaseSvc", ["MurinalFirebase", "$q", "PlotDataSvc", "UserDataSvc", function(MurinalFirebase, $q, PlotDataSvc, UserDataSvc) {

      var purchasePlot = function(userId, plotAddress) {
        var userBalancePromise = MurinalFirebase.child("users").child(userId).child("balance").once("value");

        var userDataPromise = UserDataSvc.getUserData(userId);
        var plotDataPromise = PlotDataSvc.getPlotData(plotAddress);
        //Verify plot is for sale and user can afford it
        $q.all([userDataPromise, plotDataPromise]).then(function(values) {
          var userData = values[0];
          var plotData = values[1];

          console.log(userData, plotData);
          if (userData.balance > plotData.currentPrice) {
            MurinalFirebase.child("plots").child(plotAddress.address).child("currentOwner").set(userId);
            MurinalFirebase.child("users").child(userId).child("balance").transaction(function(currentVal){
              return currentVal - plotData.currentPrice;
            });
            
            var address = plotAddress.address;
            MurinalFirebase.child("users").child(userId).child("plots").child(address).set(true);
          }
        });

        //Update user's balance and the current owner of the plot

        //Create a "sale" record

      };

      return {
        purchasePlot: purchasePlot
      };
    }]);

})();