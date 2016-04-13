
"use strict";

(function() {
  window.angular.module("murinal")
    .service("AuthSvc", ["MurinalFirebase", "$q", "$timeout", function(MurinalFirebase, $q, $timeout) {

      var authData;

      function listenForAuth() {
        var deferred = $q.defer();

        MurinalFirebase.onAuth(function(auth) {
          authData = auth;
          $timeout(function(){
            deferred.notify(authData);
          }, 0);
        });

        return deferred.promise;
      }
      listenForAuth();

      function updateUserData(authData) {
        var userRef = MurinalFirebase.child("users").child(authData.auth.uid);
        userRef.once("value", function(userDataSnapshot) {
          if (userDataSnapshot.exists()) {
            userRef.child("logins").transaction(function(currentValue) {
              return (currentValue || 0) + 1;
            });
            userRef.child("username").transaction(function(currentValue){
              return authData.twitter.username; 
            });
          }
          //For now, only create a user object if not logged in with anonymous
          else if (authData.auth.provider != "anonymous") {
            userRef.set({
              provider: authData.auth.provider,
              balance: 800,
              logins: 1
            });
          }
        });
      }

      // authenticate anonymously
      function authAnonymously() {
        var deferred = $q.defer();
        if (!authData) {
          MurinalFirebase.authAnonymously(function(err, auth) {
            if (auth) {
              updateUserData(authData);

              deferred.resolve(auth);
            }

            if (err) {
              console.log(err);
              deferred.reject(err);
            }
          })
        }
        else {
          deferred.resolve(authData);
        };

        return deferred.promise;
      }

      function thirdPartyLogin(provider) {
        var deferred = $q.defer();

        if (!authData || authData.provider != provider) {
          MurinalFirebase.authWithOAuthPopup(provider, function(err, auth) {
            if (err) {
              deferred.reject(err);
            }

            if (auth) {
              updateUserData(authData);
              deferred.resolve(auth);
            }
          });
        }
        else {
          deferred.resolve(authData);
        }

        return deferred.promise;
      };

      function auth(provider) {
        if(provider == "anonymous") {
          return authAnonymously();
        }
        else {
          return thirdPartyLogin(provider);
        }
      }

      return {
        auth: auth,
        listenForAuth: listenForAuth
      };
    }]);

})();