/// <reference path="bower_components/fabric.js/dist/fabric.js" />

"use strict";

(function() {
  var plotsSvc = window.PlotsSvc();
  
  var PLOT_SIZE = 64;
  var fabric = window.fabric;

  var murinal = new fabric.Canvas("murinal");
  murinal.setWidth(256);
  murinal.setHeight(256);
  murinal.selection = false;
  
  var xPlotOffset = 2;
  var yPlotOffset = 2;
  
  var xPixOffset = 0;
  var yPixOffset = 0;
  
  function loadPlots() {
    var numVisibleXPlots = murinal.getWidth() / PLOT_SIZE;
    var numVisibleYPlots = murinal.getHeight() / PLOT_SIZE;
    
    var xMinPlot = xPlotOffset - Math.ceil(xPixOffset / PLOT_SIZE);
    var yMinPlot = yPlotOffset - Math.ceil(yPixOffset / PLOT_SIZE);
    
    var xMaxPlot = xPlotOffset + numVisibleXPlots + Math.ceil(xPixOffset / PLOT_SIZE);
    var yMaxPlot = yPlotOffset + numVisibleYPlots + Math.ceil(yPixOffset / PLOT_SIZE);
    
    // var xMinPlot = xPlotOffset - 1;
    // var yMinPlot = yPlotOffset - 1;
    
    // var xMaxPlot = xPlotOffset + numVisibleXPlots + 1;
    // var yMaxPlot = yPlotOffset + numVisibleYPlots + 1;
    
    for(var i = xMinPlot; i<xMaxPlot; i++) {
      for (var j = yMinPlot; j<yMaxPlot; j++) {
        var plot = plotsSvc.getPlot(i, j);
        
        var rect = plot.getRect(PLOT_SIZE, xPlotOffset, yPlotOffset, xPixOffset, yPixOffset);
        murinal.add(rect);
        plots.push(rect);
      }
    }
  }

  var plots = [];
  
  loadPlots();

  murinal.on('mouse:over', function(e) {
    e.target.hover();
    murinal.renderAll();
  });

  murinal.on('mouse:out', function(e) {
    e.target.unhover();
    murinal.renderAll();
  });

  var dragging = false;
  murinal.on('mouse:down', function(e) {
    dragging = true;
  });
  murinal.on('mouse:up', function(e) {
    dragging = false;
  });
  murinal.on('mouse:move', function(e) {
    if (dragging) {
      var xOffset = 0;
      if(e.e.movementX) {
        xOffset += e.e.movementX;
      }
      
      var yOffset = 0;
      if(e.e.movementY) {
        yOffset += e.e.movementY;
      }
      
      // plots.forEach(function(n) { 
      //   n.setLeft(n.getLeft() + xOffset)
      // });
      
      // plots.forEach(function(n) { 
      //   n.setTop(n.getTop() + yOffset); n.setCoords();
      // });

      plots.forEach(function(n) { 
        //n.setTop(n.getTop() + yOffset); n.setCoords();
        murinal.remove(n);
      });
      
      xPixOffset += xOffset;
      yPixOffset += yOffset;
      
      loadPlots();
      murinal.renderAll();
    }
  });
})();