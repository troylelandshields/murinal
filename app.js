/// <reference path="bower_components/fabric.js/dist/fabric.js" />
/// <reference path="bower_components/angular/angular.js" />

"use strict";

(function() {
  var PLOT_SIZE = 64;
  window.angular.module("murinal", [
    'common.fabric-lite.canvas',
    'common.fabric-lite.utilities',
    'common.fabric-lite.constants',
    'common.fabric-lite.directive'
  ])
  .constant("PLOT_SIZE", PLOT_SIZE);
  
  // var plotsSvc = window.PlotsSvc();
  // var drawingSvc = window.DrawingSvc();

  // var fabric = window.fabric;

  // var murinal = new fabric.Canvas("murinal");
  // murinal.setWidth(window.innerWidth);
  // murinal.setHeight(window.innerHeight*0.8);
  // murinal.selection = false;
  // murinal.renderOnAddRemove = false;

  // var xPlotOffset = 0;
  // var yPlotOffset = 0;

  // var xPixOffset = 0;
  // var yPixOffset = 0;
  
  // var plots = [];

  // function loadPlots() {
  //   var numVisibleXPlots = murinal.getWidth() / PLOT_SIZE;
  //   var numVisibleYPlots = murinal.getHeight() / PLOT_SIZE;

  //   var xMinPlot = xPlotOffset - Math.ceil(xPixOffset / PLOT_SIZE) -1 ;
  //   var yMinPlot = yPlotOffset - Math.ceil(yPixOffset / PLOT_SIZE) -1 ;

  //   var xMaxPlot = xPlotOffset + numVisibleXPlots - Math.ceil(xPixOffset / PLOT_SIZE) + 1;
  //   var yMaxPlot = yPlotOffset + numVisibleYPlots - Math.ceil(yPixOffset / PLOT_SIZE) + 1;

  //   var tempPlots = [];
  //   for (var i = xMinPlot; i < xMaxPlot; i++) {
  //     for (var j = yMinPlot; j < yMaxPlot; j++) {
  //       var plot = plotsSvc.getPlot(i, j, murinal, PLOT_SIZE);
  //       tempPlots.push(plot);
  //     }
  //   }
    
  //   var cleanup = plots.filter(function(p){ return tempPlots.indexOf(p) < 0; })
  //   cleanup.forEach(function(p){ 
  //     p.cleanup(); 
  //   });
    
  //   plots = tempPlots;
  //   plots.forEach(function(p) {
  //     p.panPlot(xPlotOffset, yPlotOffset, xPixOffset, yPixOffset);
  //   });
    
  //   console.log("Total plots:", plots.length);
  //   murinal.renderAll();
  // }

  // loadPlots();

  // murinal.on('mouse:over', function(e) {
  //   e.target.hover();
  //   murinal.renderAll();
  // });

  // murinal.on('mouse:out', function(e) {
  //   e.target.unhover();
  //   murinal.renderAll();
  // });

  // var dragging = false;
  // var dragged = false;
  
  // murinal.on('mouse:down', function(e) {
  //   dragging = true;
  //   dragged = false;
  // });
  
  // murinal.on('mouse:move', function(e){
  //   dragged = true && dragging;
  // });
  
  // murinal.on('mouse:up', function(e) {
  //   dragging = false;
    
  //   if(!dragged){
  //     e.target.select();
  //   }
  // });
  
  // murinal.on('mouse:move', function(e) {
  //   if (dragging) {
  //     drawingSvc.stopDrawing();
  //     var xOffset = 0;
  //     if (e.e.movementX) {
  //       xOffset += e.e.movementX;
  //     }

  //     var yOffset = 0;
  //     if (e.e.movementY) {
  //       yOffset += e.e.movementY;
  //     }

  //     xPixOffset += xOffset;
  //     yPixOffset += yOffset;

  //     loadPlots();
  //   }
  // });
})();