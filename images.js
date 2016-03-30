"use strict";

(function() {
  window.ImageSvc = function() {
    var getImage = function(plotName) {
      var deferred = Promise.defer();
      
      setTimeout(function(){
        var imgData = localStorage.getItem(plotName+"img");
        
        if(imgData){
          deferred.resolve(imgData);
        }
        else{
          deferred.resolve(null);
        }
      }, 0);

      return deferred.promise;
    };
    
    var saveImage = function(plotName, imgData){
      localStorage.setItem(plotName+"img", imgData);
    };
    
    return {
      getImage: getImage,
      saveImage: saveImage
    };
  };
  
})();