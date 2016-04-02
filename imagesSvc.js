
"use strict";

(function() {
  window.angular.module("murinal")
    .service("ImagesSvc", ["MurinalFirebase", "$q", "$timeout", function(MurinalFirebase, $q, $timeout) {

      var listenForImage = function(imgId) {
        var deferred = $q.defer();

        var imgDataRef = MurinalFirebase.child("images").child(imgId).child("imgData");
        
        imgDataRef.on("value", function(dataSnapshot){
          $timeout(function(){
            deferred.notify(dataSnapshot.val());
          }, 0, false)
        });
        
        return deferred.promise;
      };
      
      var getImage = function(imgId) {
        var deferred = $q.defer();

        var imgDataRef = MurinalFirebase.child("images").child(imgId).child("imgData");
        
        imgDataRef.on("value", function(dataSnapshot){
          deferred.resolve(dataSnapshot.val());
        });
        
        return deferred.promise;
      };

      var saveImage = function(plotName, imgData) {
        // var newImgRef = $firebaseObject(MurinalFirebase).child("images").push();
        // newImgRef.$set({
        //   imgData: imgData,
        //   plot: plotName
        // });
        MurinalFirebase.child("images").child(plotName).set({
          imgData: imgData,
          plot: plotName
        });
      };

      return {
        getImage: getImage,
        listenForImage: listenForImage,
        saveImage: saveImage
      };
    }]);

})();