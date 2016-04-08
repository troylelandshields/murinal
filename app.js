/// <reference path="bower_components/fabric.js/dist/fabric.js" />
/// <reference path="bower_components/angular/angular.js" />

"use strict";

(function() {
  var PLOT_SIZE = 64;
  window.angular.module("murinal", [
    'common.fabric-lite.canvas',
    'common.fabric-lite.utilities',
    'common.fabric-lite.constants',
    'common.fabric-lite.directive',
    'firebase',
    'ngToast',
    'ui.router'
  ])
  .constant("PLOT_SIZE", PLOT_SIZE)
  .config(function($stateProvider, $urlRouterProvider) {

  // For any unmatched url, redirect to /
  $urlRouterProvider.otherwise("/");

  // Now set up the states
  $stateProvider
    .state('plotDetails', {
      url: "/plot/:x/:y/details",
      templateUrl: "plotdetails.html",
      controller: "PlotDetailsCtrl",
      controllerAs: "vm"
    })
    .state('murinal', {
      url: "/"
    });
});;
  
})();