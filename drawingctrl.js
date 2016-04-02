/// <reference path="bower_components/angular/angular.js" />

"use strict";

(function() {

  window.angular.module("murinal")
    .service("DrawingEventsSvc", ["$q", function($q) {

      var startDrawingDeferred = $q.defer();

      var listenForStartDrawing = function() {
        return startDrawingDeferred.promise;
      }

      var startDrawing = function(plot) {
        startDrawingDeferred.notify(plot);
      };

      var endDrawingDeferred = $q.defer();

      var listenForEndDrawing = function() {
        return endDrawingDeferred.promise;
      }

      var endDrawing = function() {
        endDrawingDeferred.notify({});
      };


      return {
        listenForStartDrawing: listenForStartDrawing,
        startDrawing: startDrawing,
        listenForEndDrawing: listenForEndDrawing,
        endDrawing: endDrawing
      };
    }])
    .factory("DrawingCanvas", ["FabricCanvas", "$window",
      function(FabricCanvas, $window) {
        var canvas;

        var init = function() {
          canvas = FabricCanvas.getCanvas();
          self.canvasId = FabricCanvas.getCanvasId();
          canvas.clear();

          canvas.setHeight(256);
          canvas.setWidth(256);

          canvas.isDrawingMode = true;
        };

        return function() {
          var self = this;
          self.getCanvas = function() { return canvas; };

          init();
        };
      }])
    .factory("DisplayCanvas", [function() {

      return function(fabricCanvas) {
        var self = this;
        self.canvas = fabricCanvas.getCanvas();
        self.canvas.clear();
        self.canvas.setHeight(256);
        self.canvas.setWidth(256);
        self.canvas.selectable = false;
        self.getCanvas = function() { return self.canvas; };
      };
    }])
    .controller("DrawingCtrl", ["$scope", "DrawingCanvas", "DisplayCanvas", "DrawingEventsSvc", "ImagesSvc", "FabricWindow", "PlotsSvc", "PLOT_SIZE",
      function($scope, DrawingCanvas, DisplayCanvas, DrawingEventsSvc, ImagesSvc, FabricWindow, PlotsSvc, PLOT_SIZE) {
        var vm = this;
        vm.drawing = {};
        vm.drawingCanvas = {};
        vm.brush = {
          type: "Pencil",
          size: 30,
          color: "#005E7A"
        };
        vm.showDrawingOptions = true;

        vm.surroundingPlots = {
          xminus1yminus1: {
            x: -1,
            y: -1,
            display: {}
          },
          xminus1: {
            x: -1,
            y: 0,
            display: {}
          },
          // xminus1yplus1: {
          //   x: -1,
          //   y: 1,
          //   display: {}
          // },
          yminus1: {
            x: 0,
            y: -1,
            display: {}
          },
          xplus1yminus1: {
            x: 1,
            y: -1,
            display: {}
          },
          xplus1: {
            x: 1,
            y: 0,
            display: {}
          },
          yplus1: {
            x: 0,
            y: 1,
            display: {}
          },
          xplus1yplus1: {
            x: 1,
            y: 1,
            display: {}
          },
        }

        var getSurroundingPlots = function(plot) {
          Object.keys(vm.surroundingPlots).forEach(function(sp) {
            var spData = vm.surroundingPlots[sp];
            var spCanvas = spData.display.getCanvas();
            spCanvas.clear();

            var x = plot.absX + spData.x;
            var y = plot.absY + spData.y;

            var surroundingPlotName = PlotsSvc.getPlotName(x, y);

            var imgPromise = ImagesSvc.getImage(surroundingPlotName);

            imgPromise.then(null, null, function(imgData) {
              if (imgData) {
                FabricWindow.Image.fromURL(imgData, function(img) {
                  img.setTop(0);
                  img.setLeft(0);
                  img.setHeight(spCanvas.getHeight());
                  img.setWidth(spCanvas.getWidth());
                  spCanvas.add(img);
                });
              }
            });
          });
        }

        vm.current = null;
        DrawingEventsSvc.listenForStartDrawing().then(null, null, function(plot) {
          vm.drawingCanvas.getCanvas().clear();
          vm.current = plot;

          var imgPromise = ImagesSvc.getImage(plot.name);

          imgPromise.then(function(imgData) {
            if (imgData) {
              FabricWindow.Image.fromURL(imgData, function(img) {
                img.setTop(0);
                img.setLeft(0);
                img.setHeight(vm.drawingCanvas.getCanvas().getHeight());
                img.setWidth(vm.drawingCanvas.getCanvas().getWidth());
                vm.drawingCanvas.getCanvas().add(img);

                vm.drawing.enabled = true;
              });
            }
            else {
              vm.drawing.enabled = true;
            }

            getSurroundingPlots(plot);
          });
        });


        vm.save = function() {
          DrawingEventsSvc.endDrawing()
          var imgData = vm.drawingCanvas.getCanvas().toDataURL({ multiplier: 0.25 });
          vm.drawingCanvas.getCanvas().clear();
          vm.current.saveImage(imgData);
          vm.current = null;
        };
        
        vm.cancel = function() {
          DrawingEventsSvc.endDrawing();
        }

        vm.clear = function() { vm.drawingCanvas.getCanvas().clear() };

        var drawingModeTxt = {
          enterDrawMode: 'Enter drawing mode',
          enterDragMode: 'Enter dragging mode'
        };
        vm.drawingModeBtnTxt = drawingModeTxt.enterDragMode;
        vm.toggleDrawingMode = function() {
          vm.drawingCanvas.getCanvas().isDrawingMode = !vm.drawingCanvas.getCanvas().isDrawingMode;
          if (vm.drawingCanvas.getCanvas().isDrawingMode) {
            vm.drawingCanvas.getCanvas().isDrawingMode = false;
            vm.drawingModeBtnText = drawingModeTxt.enterDragMode;
            vm.showDrawingOptions = false;
          }
          else {
            vm.drawingCanvas.getCanvas().isDrawingMode = true;
            vm.drawingModeBtnText = drawingModeTxt.enterDrawMode;
            vm.showDrawingOptions = true;
          }
        };

        vm.updateBrush = function() {
          var canvas = vm.drawingCanvas.getCanvas();
          canvas.freeDrawingBrush = new FabricWindow[vm.brush.type + 'Brush'](canvas);

          if (canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.color = vm.brush.color;
            canvas.freeDrawingBrush.width = vm.brush.size || 1;
            canvas.freeDrawingBrush.strokeLineCap = "round";
          }
        };

        DrawingEventsSvc.listenForEndDrawing().then(null, null, function() {
          vm.drawing.enabled = false;
        });

        var init = function(event, args) {
          if (args.name == "drawing") {
            vm.drawingCanvas = new DrawingCanvas();

            vm.updateBrush();
          }
          else if (vm.surroundingPlots[args.name]) {
            vm.surroundingPlots[args.name].display = new DisplayCanvas(args.canvas);
          }
        };

        $scope.$on('canvas:created', init);
      }]);
})();