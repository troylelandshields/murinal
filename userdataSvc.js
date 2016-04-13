"use strict";

(function() {
  window.angular.module("murinal")
    .service("UserDataSvc", ["MurinalFirebase", "$q", "$timeout", function(MurinalFirebase, $q, $timeout) {

      var getUserData = function(uid) {
        var deferred = $q.defer();

        MurinalFirebase.child("users").child(uid).once("value", function(dataSnapshot) {
          deferred.resolve(dataSnapshot.val());
        }, function(err) {
          console.log(err);
        });

        return deferred.promise;
      };
      
      var listenToUserData = function(uid) {
        var deferred = $q.defer();

        MurinalFirebase.child("users").child(uid).on("value", function(dataSnapshot) {
          $timeout(function(){
            deferred.notify(dataSnapshot.val());
          }, 0);
        }, function(err) {
          console.log(err);
        });

        return deferred.promise;
      };

      return {
        getUserData: getUserData,
        listenToUserData: listenToUserData
      };
    }]);

})();