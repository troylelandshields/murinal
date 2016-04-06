
"use strict";

(function() {
  window.angular.module("murinal")
    .service("ImagesSvc", ["MurinalFirebase", "$q", "$timeout", function(MurinalFirebase, $q, $timeout) {

      var listenForImage = function(plotAddress) {
        var deferred = $q.defer();

        var imgDataRef = MurinalFirebase.child("images").child(plotAddress).child("imgData");
        
        imgDataRef.on("value", function(dataSnapshot){
          $timeout(function(){
            deferred.notify(dataSnapshot.val());
          }, 0, false)
        });
        
        return deferred.promise;
      };
      
      var getImage = function(plotAddress) {
        var deferred = $q.defer();

        var imgDataRef = MurinalFirebase.child("images").child(plotAddress).child("imgData");
        
        imgDataRef.on("value", function(dataSnapshot){
          deferred.resolve(dataSnapshot.val());
        });
        
        return deferred.promise;
      };

      var saveImage = function(plotAddress, imgData) {
        MurinalFirebase.child("images").child(plotAddress).set({
          imgData: imgData.bytes,
          //artist: imgData.artist,
          plot: plotAddress
        });
      };

      return {
        getImage: getImage,
        listenForImage: listenForImage,
        saveImage: saveImage
      };
    }]);

})();