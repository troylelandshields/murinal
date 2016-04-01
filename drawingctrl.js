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
    .controller("DrawingCtrl", ["$scope", "DrawingCanvas", "DrawingEventsSvc", "ImagesSvc", "FabricWindow",
      function($scope, DrawingCanvas, DrawingEventsSvc, ImagesSvc, FabricWindow) {
        var vm = this;
        vm.drawing = {};
        vm.drawingCanvas = {};
        vm.brush = {
          type: "Pencil",
          size: 30,
          color: "#005E7A"
        };
        vm.showDrawingOptions = true;
        
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
          });
        });

        vm.save = function() {
          DrawingEventsSvc.endDrawing()
          var imgData = vm.drawingCanvas.getCanvas().toDataURL({ multiplier: 0.25 });
          vm.drawingCanvas.getCanvas().clear();
          vm.current.saveImage(imgData);
          vm.current = null;
        };

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
        };

        $scope.$on('canvas:created', init);
      }]);
})();