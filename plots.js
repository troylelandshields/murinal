
"use strict";

(function() {
  
  var drawingSvc = window.DrawingSvc();
  
  var Plot = function(x, y) {
    this.absX = x;
    this.absY = y;
    
    this.name = this.absX+","+this.absY;
  };
  
  Plot.prototype.plotRect = function(murinal, PLOT_SIZE, xPlotOffset, yPlotOffset, xPixOffset, yPixOffset) {
    this.murinal = murinal;
    this.left = ((this.absX - xPlotOffset ) * PLOT_SIZE) + xPixOffset;
    this.top = ((this.absY - yPlotOffset) * PLOT_SIZE) + yPixOffset;
    
    if (!this.shape) {
      //Plot rect for first time
      var rect = new fabric.Rect({
        width: PLOT_SIZE,
        height: PLOT_SIZE,
        stroke: "black",
        fill: "white",
        opacity: 0.1
      });
      
      this.loadRect(murinal, rect);
      
      var text = new fabric.Text(this.name, {
        fontSize: 12
      });
      
      this.shape = new fabric.Group([rect, text], {
        top: this.top,
        left: this.left,
        hasControls: false,
        lockMovementX: true,
        lockMovementY: true,
        transparentCorners: false,
        selectable: true
      });
      
      this.shape.hover = function() {
        rect.setOpacity(0.3);
      };
      this.shape.unhover = function() {
        rect.setOpacity(0.1);
      };
      var that = this;
      this.shape.select = function() {
        drawingSvc.startDrawing(that);
      };

      murinal.add(this.shape);
      console.log("Added", this.name);
    }
    
    this.shape.setTop(this.top);
    this.shape.setLeft(this.left);
    this.shape.setCoords();
  };
  
  Plot.prototype.loadRect = function(murinal, rect) {
    window.setTimeout(function(){
      rect.fill = "blue";
      murinal.renderAll();
    }, 10);
  }
  
  Plot.prototype.cleanup = function(murinal) {
    murinal.remove(this.shape);
    //this.shape.remove();
    
    console.log("Removed", this.name);
    this.shape = null;
  };
  
  Plot.prototype.setImage = function(imgData) {
    var that = this;
    new fabric.Image.fromURL(imgData, function(img){
      img.setTop(-(that.shape.getHeight()/2));
      img.setLeft(-(that.shape.getWidth()/2));
      that.shape.add(img);
    });
  };
  
  window.PlotsSvc = function() {
    
    var plots = {};
    
    var getPlot = function(x, y) {
      var plotName = x+","+y;
      
      if(!plots[plotName])
      {
        plots[plotName] = new Plot(x,y);
      }
      
      return plots[plotName];
    };
    
    return {
      getPlot: getPlot  
    };
  };
  
})();