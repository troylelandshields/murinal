"use strict";

(function() {
  window.angular.module("murinal")
    .service("UserDataSvc", ["MurinalFirebase", "$q", function(MurinalFirebase, $q) {

      var getUserData = function(uid) {
        var deferred = $q.defer();

        MurinalFirebase.child("users").child(uid).once("value", function(dataSnapshot) {
          deferred.resolve(dataSnapshot.val());
        }, function(err) {
          console.log(err);
        });

        return deferred.promise;
      };

      return {
        getUserData: getUserData
      };
    }]);

})();