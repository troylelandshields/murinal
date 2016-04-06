/// <reference path="bower_components/angular/angular.js" />

"use strict";

(function() {

  window.angular.module("murinal")
    .controller("NavCtrl", ["AuthSvc", "UserDataSvc", function(AuthSvc, UserDataSvc) {
      var vm = this;
      vm.auth = null;

      AuthSvc.listenForAuth().then(null, null, function(authData) {
        vm.auth = authData;

        if (vm.auth) {
          UserDataSvc.getUserData(vm.auth.uid).then(function(userData) {
            vm.userData = userData;
          });
        }
        else {
          AuthSvc.auth("anonymous");
        }
      });

      vm.login = function(provider) {
        AuthSvc.auth(provider);
      };

    }]);
})();