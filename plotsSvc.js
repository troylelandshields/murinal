
"use strict";

(function() {

  window.angular.module("murinal")
    .service("PlotsSvc", ["$rootScope", "DrawingEventsSvc", "ImagesSvc", "PlotDataSvc", "AuthSvc", "$q", "ngToast", "$location", "$state",
      function($rootScope, DrawingEventsSvc, ImagesSvc, PlotDataSvc, AuthSvc, $q, ngToast, $location, $state) {

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
          
          var unhoverState = {};
          var that = this;
          this.shape.hover = function() {
            if (that.shape && !($state.params.x == that.absX && $state.params.y == that.absY)) {
              unhoverState = {
                stroke: that.shape.item(0).getStroke(),
                strokeWidth: that.shape.item(0).getStrokeWidth()
              };
              that.shape.item(0).setStrokeWidth(1);
              that.shape.item(0).setStroke("#8080ff");
              that.murinal.bringToFront(that.shape);
            }
          };
          this.shape.unhover = function() {
            if (that.shape && !($state.params.x == that.absX && $state.params.y == that.absY)) {
              that.shape.item(0).setStrokeWidth(unhoverState.strokeWidth);
              that.shape.item(0).setStroke(unhoverState.stroke);
              that.murinal.sendToBack(that.shape);
            }
          };

          var that = this;
          this.shape.select = function() {
            if (that.shape) {
              that.shape.item(0).setStroke("#4f50a5");
              that.shape.item(0).setStrokeWidth(2);
              that.murinal.bringToFront(that.shape);
              
              $state.go("plotDetails", {
                x: that.getAddress().x,
                y: that.getAddress().y
              });
              
              //$location.search('selected', that.getAddress().address);
              //DrawingEventsSvc.startDrawing(that);
            }
          };

          this.shape.selectable = false;
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
            stroke: "#ccccff",
            fill: "rgba(0, 0, 0, 0)"
          });

          this.loadRect(this.murinal, rect);

          var fontSize = 12;
          var text = new fabric.Text(this.name, {
            fontSize: fontSize,
            top: (this.plotSize/2) - (fontSize/2),
            left: 8
          });

          text.setColor("gray");
          this.recreateShape([rect, text]);

        };

        Plot.prototype.panPlot = function(xPlotOffset, yPlotOffset, xPixOffset, yPixOffset) {
          $location.search('selected', null);
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
          promise.then(null, null, function(imgData) {
            if (imgData) {
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
            if (that.shape) {
              img.setTop(-(that.shape.getHeight() / 2));
              img.setLeft(-(that.shape.getWidth() / 2));

              that.recreateShape([img]);
            }
          });
        };

        Plot.prototype.getAddress = function() {
          return { x: this.absX, y: this.absY, address: this.name };
        };
        
        var authData = null;
        AuthSvc.listenForAuth().then(null, null, function(auth){
          authData = auth;
        });

        Plot.prototype.saveImage = function(imgData) {
          var that = this;

          this.setImage(imgData.bytes);

          PlotDataSvc.getPlotData(this.getAddress()).then(function(plotData) {

            if (!authData || authData.provider == "anonymous") {
              //show error
              ngToast.create({
                className: 'danger',
                content: 'Sorry, you must be logged in to add to the Murinal.'
              });
              that.cleanup();
              return;
            }

            var userId = authData.auth.uid;
            var plotOwner = plotData.currentOwner;

            if (!plotOwner) {
              ngToast.create({
                className: 'danger',
                content: 'Oops, you must buy that space before you can leave your mark.'
              });
              that.cleanup();
            }
            else if (plotOwner === userId) {
              console.log("user owns plot, updating image");
              imgData.artist = authData.auth.uid;
              ImagesSvc.saveImage(that.name, imgData);
            }
            else {
              //Else show an error
              console.log("Error: user", userId, "cannot edit plot owned by", plotOwner);
              ngToast.create({
                className: 'danger',
                content: 'Sorry, you can only edit spaces that you own.'
              });
              that.cleanup();
            }
          });
        };

        var plots = {};

        var findPlot = function(x, y) {
          var plotName = getPlotName(x, y);
          return plots[plotName];
        };

        var getPlot = function(x, y, murinal, plotSize) {
          var plotName = getPlotName(x, y);

          if (!findPlot(x, y)) {
            if (murinal && plotSize) {
              plots[plotName] = new Plot(x, y, murinal, plotSize);
            }
          }

          return findPlot(x, y);
        };

        var getPlotName = function(x, y) {
          var plotName = x + "," + y;

          return plotName;
        };

        var loadPlots = function() {

        };

        return {
          getPlot: getPlot,
          getPlotName: getPlotName,
          findPlot: findPlot
        };
      }]);

})();