/// <reference path="bower_components/fabric.js/dist/fabric.js" />

"use strict";

(function() {

  var showDrawing = function() {
    var nodes = document.getElementsByClassName("drawing");

    for (var i = 0; i < nodes.length; i++) {
      var e = nodes[i];
      e.style.visibility = "visible";
    }
  }

  var hideDrawing = function() {
    var nodes = document.getElementsByClassName("drawing");

    for (var i = 0; i < nodes.length; i++) {
      var e = nodes[i];
      e.style.visibility = "hidden";
    }
  }

  var $ = function(id) { return document.getElementById(id) };

  var current = null;

  var canvas = new fabric.Canvas('drawing', {
    isDrawingMode: true
  });

  var canvasxminus1 = new fabric.StaticCanvas('drawing-xminus1');
  var canvasyminus1 = new fabric.StaticCanvas('drawing-yminus1');
  var canvasxplus1 = new fabric.StaticCanvas('drawing-xplus1');
  var canvasyplus1 = new fabric.StaticCanvas('drawing-yplus1');

  canvas.setHeight(256);
  canvas.setWidth(256);

  canvasxminus1.setHeight(256);
  canvasxminus1.setWidth(256);
  canvasyminus1.setHeight(256);
  canvasyminus1.setWidth(256);
  canvasxplus1.setHeight(256);
  canvasxplus1.setWidth(256);
  canvasyplus1.setHeight(256);
  canvasyplus1.setWidth(256);

  fabric.Object.prototype.transparentCorners = false;

  var drawingModeEl = $('drawing-mode'),
    drawingOptionsEl = $('drawing-mode-options'),
    drawingColorEl = $('drawing-color'),
    drawingShadowColorEl = $('drawing-shadow-color'),
    drawingLineWidthEl = $('drawing-line-width'),
    drawingShadowWidth = $('drawing-shadow-width'),
    drawingShadowOffset = $('drawing-shadow-offset'),
    clearEl = $('clear-canvas'),
    saveBtn = $('save-drawing');

  saveBtn.onclick = function() {
    hideDrawing();
    var imgData = canvas.toDataURL({ multiplier: 0.25 });
    canvas.clear();
    current.saveImage(imgData);
    current = null;
  };

  clearEl.onclick = function() { canvas.clear() };

  drawingModeEl.onclick = function() {
    canvas.isDrawingMode = !canvas.isDrawingMode;
    if (canvas.isDrawingMode) {
      drawingModeEl.innerHTML = 'Enter dragging mode';
      drawingOptionsEl.style.display = '';
    }
    else {
      drawingModeEl.innerHTML = 'Enter drawing mode';
      drawingOptionsEl.style.display = 'none';
    }
  };

  $('drawing-mode-selector').onchange = function() {

    canvas.freeDrawingBrush = new fabric[this.value + 'Brush'](canvas);

    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = drawingColorEl.value;
      canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
      canvas.freeDrawingBrush.shadowBlur = parseInt(drawingShadowWidth.value, 10) || 0;
      canvas.freeDrawingBrush.strokeLineCap = "butt";
    }
  };

  drawingColorEl.onchange = function() {
    canvas.freeDrawingBrush.color = this.value;
  };
  drawingLineWidthEl.onchange = function() {
    canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
    this.previousSibling.innerHTML = this.value;
  };

  if (canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.color = drawingColorEl.value;
    canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
    canvas.freeDrawingBrush.shadowBlur = 0;
  }

  var imageSvc = window.ImageSvc();

  window.DrawingSvc = function() {
    var startDrawing = function(plot) {
      canvas.clear();
      current = plot;

      var imgPromise = imageSvc.getImage(current.name);

      imgPromise.then(function(imgData) {
        if (imgData) {
          fabric.Image.fromURL(imgData, function(img) {
            img.setTop(0);
            img.setLeft(0);
            img.setHeight(canvas.getHeight());
            img.setWidth(canvas.getWidth());
            canvas.add(img);
            showDrawing();
          });
        }
        else {
          showDrawing();
        }
      });

      //Get surrounding plots too
      [{
        canvas: canvasxminus1,
        plotName: (current.absX - 1) + "," + current.absY
      }, {
          canvas: canvasyminus1,
          plotName: (current.absX) + "," + (current.absY - 1)
        }, {
          canvas: canvasxplus1,
          plotName: (current.absX + 1) + "," + (current.absY)
        }, {
          canvas: canvasyplus1,
          plotName: (current.absX) + "," + (current.absY + 1)
        }].forEach(function(d) {
          d.canvas.clear();
          var imgPromise = imageSvc.getImage(d.plotName);
          imgPromise.then(function(imgData) {
            if (imgData) {
              fabric.Image.fromURL(imgData, function(img) {
                img.setTop(0);
                img.setLeft(0);
                img.setHeight(d.canvas.getHeight());
                img.setWidth(d.canvas.getWidth());
                d.canvas.add(img);
              });
            }
          });
        });
    };

    var stopDrawing = function() {
      hideDrawing();
    };

    return {
      startDrawing: startDrawing,
      stopDrawing: stopDrawing
    };
  };
})();