/// <reference path="bower_components/fabric.js/dist/fabric.js" />

"use strict";

(function() {
  var plotsSvc = window.PlotsSvc();

  var PLOT_SIZE = 64;
  var fabric = window.fabric;

  var murinal = new fabric.Canvas("murinal");
  murinal.setWidth(window.innerWidth);
  murinal.setHeight(window.innerHeight);
  murinal.selection = false;
  murinal.renderOnAddRemove = false;

  var xPlotOffset = 0;
  var yPlotOffset = 0;

  var xPixOffset = 0;
  var yPixOffset = 0;
  
  var plots = [];

  function loadPlots() {
    var numVisibleXPlots = murinal.getWidth() / PLOT_SIZE;
    var numVisibleYPlots = murinal.getHeight() / PLOT_SIZE;

    var xMinPlot = xPlotOffset - Math.ceil(xPixOffset / PLOT_SIZE) -1 ;
    var yMinPlot = yPlotOffset - Math.ceil(yPixOffset / PLOT_SIZE) -1 ;

    var xMaxPlot = xPlotOffset + numVisibleXPlots - Math.ceil(xPixOffset / PLOT_SIZE) + 1;
    var yMaxPlot = yPlotOffset + numVisibleYPlots - Math.ceil(yPixOffset / PLOT_SIZE) + 1;

    var tempPlots = [];
    for (var i = xMinPlot; i < xMaxPlot; i++) {
      for (var j = yMinPlot; j < yMaxPlot; j++) {
        var plot = plotsSvc.getPlot(i, j);
        tempPlots.push(plot);
      }
    }
    
    var cleanup = plots.filter(function(p){ return tempPlots.indexOf(p) < 0; })
    cleanup.forEach(function(p){ 
      p.cleanup(murinal); 
    });
    
    plots = tempPlots;
    plots.forEach(function(p) {
      p.plotRect(murinal, PLOT_SIZE, xPlotOffset, yPlotOffset, xPixOffset, yPixOffset);
    });
    
    console.log("Total plots:", plots.length);
    murinal.renderAll();
  }

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
      if (e.e.movementX) {
        xOffset += e.e.movementX;
      }

      var yOffset = 0;
      if (e.e.movementY) {
        yOffset += e.e.movementY;
      }

      xPixOffset += xOffset;
      yPixOffset += yOffset;

      loadPlots();
    }
  });
  
  murinal.on('object:selected', function(e){
    e.target.select();
  });
})();