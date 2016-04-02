
"use strict";

(function() {

  window.angular.module("murinal")
    .service("PlotsSvc", ["$rootScope", "DrawingEventsSvc", "ImagesSvc", "PlotDataSvc", function($rootScope, DrawingEventsSvc, ImagesSvc, PlotDataSvc) {

      var Plot = function(x, y, murinal, plotSize) {
        this.absX = x;
        this.absY = y;
        this.murinal = murinal;
        this.plotSize = plotSize;

        this.name = this.absX + "," + this.absY;
      };

      Plot.prototype.recreateShape = function(objects) {
        if (this.shape) {
          //remove everything shape
          this.cleanup();
        }

        this.shape = new fabric.Group(objects, {
          top: this.top,
          left: this.left,
          hasControls: false,
          lockMovementX: true,
          lockMovementY: true,
          transparentCorners: false,
          selectable: false
        });

        var that = this;
        this.shape.hover = function() {
          if (that.shape) {
            that.shape.setStroke("gray");
          }
        };
        this.shape.unhover = function() {
          if (that.shape) {
            //that.shape.setStroke(null);
          }
        };
        
        var that = this;
        this.shape.select = function() {
          if (that.shape) {
            that.shape.setStroke("black");
            DrawingEventsSvc.startDrawing(that);
          }
        };

        
        this.shape.setStroke("black");
        this.shape.setTop(this.top);
        this.shape.setLeft(this.left);
        this.shape.setCoords();

        this.murinal.add(this.shape);
      };

      Plot.prototype.plotRect = function() {
        //Plot rect for first time
        var rect = new fabric.Rect({
          width: this.plotSize,
          height: this.plotSize,
          stroke: "black",
          fill: "white",
          opacity: 0.1
        });

        this.loadRect(this.murinal, rect);

        var text = new fabric.Text(this.name, {
          fontSize: 12
        });

        this.recreateShape([rect, text]);

        //console.log("Added", this.name);
      };

      Plot.prototype.panPlot = function(xPlotOffset, yPlotOffset, xPixOffset, yPixOffset) {
        this.left = ((this.absX - xPlotOffset) * this.plotSize) + xPixOffset;
        this.top = ((this.absY - yPlotOffset) * this.plotSize) + yPixOffset;

        if (!this.shape) {
          this.plotRect();
        }

        this.shape.setTop(this.top);
        this.shape.setLeft(this.left);
        this.shape.setCoords();
      };

      Plot.prototype.loadRect = function(murinal, rect) {
        var promise = ImagesSvc.listenForImage(this.name);

        var that = this;
        promise.then(null, null, function(imgData){
          if(imgData){
            that.setImage(imgData);
          }
        });
      }

      Plot.prototype.cleanup = function() {
        this.murinal.remove(this.shape);

        //console.log("Removed", this.name);
        this.shape = null;
      };

      Plot.prototype.setImage = function(imgData) {
        var that = this;
        new fabric.Image.fromURL(imgData, function(img) {
          if(that.shape){
            img.setTop(-(that.shape.getHeight() / 2));
            img.setLeft(-(that.shape.getWidth() / 2));

            that.recreateShape([img]);
          }
        });
      };

      Plot.prototype.saveImage = function(imgData) {
        PlotDataSvc.storePlotData(this.name, { owner: "me" });
        ImagesSvc.saveImage(this.name, imgData);

        this.setImage(imgData);
      };

      var plots = {};

      var getPlot = function(x, y, murinal, plotSize) {
        var plotName = getPlotName(x, y);

        if (!plots[plotName]) {
          if(murinal && plotSize) {
            plots[plotName] = new Plot(x, y, murinal, plotSize);
          }
        }

        return plots[plotName];
      };
      
      var getPlotName = function(x, y) {
        var plotName = x + "," + y;
        
        return plotName;
      };

      var loadPlots = function() {

      };

      return {
        getPlot: getPlot,
        getPlotName: getPlotName
      };
    }]);

})();