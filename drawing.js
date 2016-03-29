
"use strict";

(function() {
  
  
  window.DrawingSvc = function() {
    var startDrawing = function(plot) {
      document.getElementById("drawing-div").style.visibility = "visible";
      
      window.current = plot;
    };
    
    return {
      startDrawing: startDrawing  
    };
  };
  
})();