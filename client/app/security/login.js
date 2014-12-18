var login = angular.module('login', []);

login.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl:'app/security/login.tpl.html',
    resolve: login.resolve
  });
}]);

login.controller('LoginCtrl', ['$scope', '$rootScope', '$location','AuthService', 'User', 'MySave',
 function($scope, $rootScope, $location, AuthService, User, MySave) {
	$scope.message;
	$scope.formData = {};
	$scope.loginPromise;
	$scope.expires = null;
	$scope.message2;
}]);