/// <reference path="bower_components/angular/angular.js" />

"use strict";

(function() {

  window.angular.module("murinal")
    .controller("PlotDetailsCtrl", ["PlotDataSvc", "AuthSvc", "UserDataSvc", "PurchaseSvc", "DrawingEventsSvc", "PlotsSvc", "$state", function(PlotDataSvc, AuthSvc, UserDataSvc, PurchaseSvc, DrawingEventsSvc, PlotsSvc, $state) {
      var vm = this;
      vm.authData;
      //TODO: figure out how to get the address
      var address = { x: $state.params.x, y: $state.params.y, address: $state.params.x + "," + $state.params.y };
      PlotDataSvc.listenToPlotData(address).then(null, null, function(plotData) {
        //console.log(plotData);
        vm.plotData = plotData;
      });
      
      AuthSvc.listenForAuth().then(null, null, function(auth){
        //console.log(auth);
        if(auth.provider != "anonymous" && auth.uid){
          vm.authData = auth;
          UserDataSvc.getUserData(auth.uid).then(function(userData){
            //console.log(userData);
            vm.userData = userData;
          });
        }
      });
      
      vm.purchase = function(address) {
        console.log("buy", address);
        PurchaseSvc.purchasePlot(vm.authData.uid, address);
      };
      
      vm.draw = function(address) {
        var plot = PlotsSvc.findPlot(address.x, address.y);
        DrawingEventsSvc.startDrawing(plot);
      };
    }]);
})();