/// <reference path="bower_components/angular/angular.js" />

"use strict";

(function() {

  window.angular.module("murinal")
    .controller("PlotDetailsCtrl", ["PlotDataSvc", "AuthSvc", "UserDataSvc", "PurchaseSvc", "DrawingEventsSvc", "PlotsSvc", "$state", function(PlotDataSvc, AuthSvc, UserDataSvc, PurchaseSvc, DrawingEventsSvc, PlotsSvc, $state) {
      var vm = this;
      vm.authData;

      var address = { x: $state.params.x, y: $state.params.y, address: $state.params.x + "," + $state.params.y };
      PlotDataSvc.listenToPlotData(address).then(null, null, function(plotData) {
        vm.plotData = plotData;
        
        if(vm.plotData.currentOwner) {
          UserDataSvc.listenToUserData(vm.plotData.currentOwner).then(null, null, function(ownerData){
            vm.plotData.ownerData = ownerData;
          });
        }
      });
      
      AuthSvc.listenForAuth().then(null, null, function(auth){
        if(auth.provider != "anonymous" && auth.uid){
          vm.authData = auth;
          UserDataSvc.getUserData(auth.uid).then(function(userData){
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