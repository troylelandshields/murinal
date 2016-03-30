"use strict";

(function() {
  window.PlotDataSvc = function() {
    var getPlotData = function(plotName) {
      var deferred = Promise.defer();
      
      setTimeout(function(){
        var data = JSON.parse(localStorage.getItem(plotName));
        
        if(data){
          deferred.resolve(data);
        }
        else{
          deferred.reject();
        }
      }, 0);

      return deferred.promise;
    };
    
    var storePlotData = function(plotName, data){
      localStorage.setItem(plotName, JSON.stringify(data));
    };
    
    return {
      getPlotData: getPlotData,
      storePlotData: storePlotData
    };
  };
  
})();