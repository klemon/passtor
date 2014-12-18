var welcome = angular.module('welcome', []);

welcome.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/welcome', {
    templateUrl:'app/dashboard/welcome.tpl.html',
    controller: 'WelcomeCtrl',
    resolve: welcome.resolve
  });
}]);

welcome.controller('WelcomeCtrl', ['$scope',
	function($scope) {
        console.log("welcome");
}]);