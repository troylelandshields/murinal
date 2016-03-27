
"use strict";

(function() {
  
  var Plot = function(x, y) {
    this.absX = x;
    this.absY = y;
  };
  
  Plot.prototype.getRect = function(PLOT_SIZE, xPlotOffset, yPlotOffset, xPixOffset, yPixOffset) {
    
    if (!this.shape) {

      var rect = new fabric.Rect({
        width: PLOT_SIZE,
        height: PLOT_SIZE,
        stroke: "black",
        fill: "white",
        opacity: 0.1
      });
      
      var text = new fabric.Text(this.absX+","+this.absY, {});
      
      this.shape = new fabric.Group([rect, text], {
        top: ((this.absY - yPlotOffset) * PLOT_SIZE) + yPixOffset,
        left: ((this.absX - xPlotOffset ) * PLOT_SIZE) + xPixOffset,
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
      
    }

    return this.shape;
  };

  
  window.PlotsSvc = function() {
    
    var getPlot = function(x, y) {
      return new Plot(x,y);
    };
    
    return {
      getPlot: getPlot  
    };
  };
  
})();