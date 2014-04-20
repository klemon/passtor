var app = angular.module('app', [
	'ngRoute',
	'dashboard',
	'store',
	'login',
	'signup',
	'profile',
	'editProfile',
	'createPost',
	'inventory'
	]);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  
  $routeProvider.otherwise({redirectTo:'/'});
  $locationProvider.html5Mode(true);
  
  }])
.controller('AppCtrl', ['$scope', '$location', 'AuthService',
	function($scope, $location, AuthService) {
	if(AuthService.isLoggedIn())
		$location.path('/dashboard');
	else
		$location.path('/inventory');
}])

.controller('HeaderCtrl', ['$scope', '$location','AuthService', '$http', function($scope, $location, AuthService, $http){
	
	$scope.logout = function(){
		$location.path('/login');
		AuthService.logout();
	}
	$scope.currentUser = function(){
		return AuthService.currentUser();
	}
	$scope.isLoggedIn = function() {
		return AuthService.isLoggedIn();
	}
	$scope.isStoreOwner = function() {
		return AuthService.isStoreOwner();
	}
}]);

app.factory('AuthService', ['$http', '$location', function($http, $location) {
	var currentUser;
	var isStoreOwner;
	return {
		login: function(data, done) {
		$http.post('/login', {email: data.email, password: data.password})
			.success(function(res) {
				currentUser = res.user;
				//isStoreOwner = currentUser; for testing
				done(res.message);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
		},
		logout: function() {
			console.log('logout');
			currentUser = "";
			isStoreOwner = false;
			$http.get('./logout');
		},
		isLoggedIn: function() {
			if(currentUser)
				return true;
			return false;
		},
		currentUser: function() { 
			return currentUser; 
		},
		isStoreOwner: function() {
			return isStoreOwner;
		},
		signup: function(data, done) {
		$http.post('/signup', {email: data.email, password: data.password})
			.success(function(res) {
				done(res.message);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
		},
		update: function(data) {
			currentUser = data;
		}
	};
}]);


