'use strict'

angular.module('app', [])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/', {
    controller:'appCtrl'
  });
}])

.controller('appCtrl', ['$scope' function ($scope) {

  $scope.submit = function() {
    
  };
}]);
