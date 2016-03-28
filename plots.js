
"use strict";

(function() {
  
  var Plot = function(x, y) {
    this.absX = x;
    this.absY = y;
    this.name = this.absX+","+this.absY;
  };
  
  Plot.prototype.plotRect = function(murinal, PLOT_SIZE, xPlotOffset, yPlotOffset, xPixOffset, yPixOffset) {
    
    var left = ((this.absX - xPlotOffset ) * PLOT_SIZE) + xPixOffset;
    var top = ((this.absY - yPlotOffset) * PLOT_SIZE) + yPixOffset;
    
    if (!this.shape) {
      //Plot rect for first time
      var rect = new fabric.Rect({
        width: PLOT_SIZE,
        height: PLOT_SIZE,
        stroke: "black",
        fill: "white",
        opacity: 0.1
      });
      
      var text = new fabric.Text(this.name, {
        fontSize: 12
      });
      
      this.shape = new fabric.Group([rect, text], {
        top: top,
        left: left,
        hasControls: false,
        lockMovementX: true,
        lockMovementY: true,
        transparentCorners: false,
        selectable: false
      });
      
      this.shape.hover = function() {
        rect.setOpacity(0.3);
      };
      this.shape.unhover = function() {
        rect.setOpacity(0.1);
      };

      murinal.add(this.shape);
      console.log("Added", this.name);
    }

    
    this.shape.setTop(top);
    this.shape.setLeft(left);
    this.shape.setCoords();
  };
  
  Plot.prototype.cleanup = function(murinal) {
    murinal.remove(this.shape);
    //this.shape.remove();
    
    console.log("Removed", this.name);
    this.shape = null;
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