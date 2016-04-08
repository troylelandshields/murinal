/// <reference path="bower_components/angular/angular.js" />

"use strict";

(function() {

  window.angular.module("murinal")
    .service("MurinalCanvasOptions", ["$window", function($window) {
      return {
        getHeight: function() {
          return $window.innerHeight * 0.8;
        },
        getWidth: function() {
          return $window.innerWidth;
        }
      };
    }])
    .factory('MurinalGridCanvas', ['FabricCanvas', "MurinalCanvasOptions",
      function(FabricCanvas, MurinalCanvasOptions) {
        var canvas;

        var init = function() {
          canvas = FabricCanvas.getCanvas();
          self.canvasId = FabricCanvas.getCanvasId();
          canvas.clear();

          canvas.renderOnAddRemove = false;

          canvas.setHeight(MurinalCanvasOptions.getHeight());
          canvas.setWidth(MurinalCanvasOptions.getWidth());
        };

        return function() {
          var self = this;
          self.getCanvas = function() { return canvas; };

          init();
        };
      }])
    .controller("MurinalGridCtrl", ["$scope", "FabricConstants", "MurinalGridCanvas", "PlotsSvc", "PLOT_SIZE", "DrawingEventsSvc", "$location",
      function($scope, FabricConstants, MurinalGridCanvas, PlotsSvc, PLOT_SIZE, DrawingEventsSvc, $location) {
        var vm = this;
        vm.murinal = {};

        vm.panZoom = {
          xPixOffset: 0,
          yPixOffset: 0
        };

        //TODO FIX THIS, SUCH A HACK rewrite this logic so we use state params, probably need to make plotDetails state a child of plotFocus or something
        var startingX = -33;
        var startingY = -33
        if($location.url())
        {
          var re = /\/plot\/(-*\d*)\/(-*\d*)/i
          var matches = $location.url().match(re);
          
          if(matches.length == 3) 
          {
            startingX = parseInt(matches[1]);
            startingY = parseInt(matches[2]);
          }
        }
        
        
        vm.location = {
          x: startingX,
          y: startingY
        };

        var plots = [];
        function loadPlots() {
          var numVisibleXPlots = vm.murinal.getCanvas().width / PLOT_SIZE;
          var numVisibleYPlots = vm.murinal.getCanvas().height / PLOT_SIZE;

          var xMinPlot = vm.location.x - Math.ceil(vm.panZoom.xPixOffset / PLOT_SIZE) - 1;
          var yMinPlot = vm.location.y - Math.ceil(vm.panZoom.yPixOffset / PLOT_SIZE) - 1;

          var xMaxPlot = vm.location.x + numVisibleXPlots - Math.ceil(vm.panZoom.xPixOffset / PLOT_SIZE) + 1;
          var yMaxPlot = vm.location.y + numVisibleYPlots - Math.ceil(vm.panZoom.yPixOffset / PLOT_SIZE) + 1;

          var tempPlots = [];
          for (var i = xMinPlot; i < xMaxPlot; i++) {
            for (var j = yMinPlot; j < yMaxPlot; j++) {
              var plot = PlotsSvc.getPlot(i, j, vm.murinal.getCanvas(), PLOT_SIZE);
              tempPlots.push(plot);
            }
          }

          var cleanup = plots.filter(function(p) { return tempPlots.indexOf(p) < 0; })
          cleanup.forEach(function(p) {
            p.cleanup();
          });

          plots = tempPlots;
          plots.forEach(function(p) {
            p.panPlot(vm.location.x, vm.location.y, vm.panZoom.xPixOffset, vm.panZoom.yPixOffset);
          });

          console.log("Total plots:", plots.length);
          vm.murinal.getCanvas().renderAll();
        }

        var initEventListeners = function() {
          vm.murinal.getCanvas().on('mouse:over', function(e) {
            e.target.hover();
            vm.murinal.getCanvas().renderAll();
          });

          vm.murinal.getCanvas().on('mouse:out', function(e) {
            e.target.unhover();
            vm.murinal.getCanvas().renderAll();
          });

          var dragging = false;
          var dragged = false;

          vm.murinal.getCanvas().on('mouse:down', function(e) {
            dragging = true;
            dragged = false;
          });

          vm.murinal.getCanvas().on('mouse:move', function(e) {
            dragged = true && dragging;
          });

          vm.murinal.getCanvas().on('mouse:up', function(e) {
            dragging = false;

            if (!dragged) {
              e.target.select();
            }
          });

          vm.murinal.getCanvas().on('mouse:move', function(e) {
            if (dragging) {
              DrawingEventsSvc.endDrawing();
              var xOffset = 0;
              if (e.e.movementX) {
                xOffset += e.e.movementX;
              }

              var yOffset = 0;
              if (e.e.movementY) {
                yOffset += e.e.movementY;
              }

              vm.panZoom.xPixOffset += xOffset;
              vm.panZoom.yPixOffset += yOffset;

              loadPlots();
            }
          });
        };

        var init = function(event, args) {
          if (args.name == "murinal") {
            vm.murinal = new MurinalGridCanvas();

            loadPlots();
            initEventListeners();
          }
        };

        $scope.$on('canvas:created', init);
      }]);
})();