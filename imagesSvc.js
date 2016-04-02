
"use strict";

(function() {
  window.angular.module("murinal")
    .service("ImagesSvc", ["MurinalFirebase", "$q", function(MurinalFirebase, $q) {

      var listenForImage = function(imgId) {
        var deferred = $q.defer();

        var imgDataRef = MurinalFirebase.child("images").child(imgId).child("imgData");
        
        imgDataRef.on("value", function(dataSnapshot){
          deferred.notify(dataSnapshot.val());
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