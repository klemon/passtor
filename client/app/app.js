var app = angular.module('app', [
	'ngRoute',
	'dashboard',
	'store',
	'login',
	'signup',
	'profile',
	'editProfile',
	'createPost',
	'inventory',
	'createItem',
	'post'
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
		$location.path('/login');
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
	$scope.storeName = function() {
		return AuthService.storeName();
	}
}]);


app.factory('AuthService', ['$http', '$location', function($http, $location) {
	var currentUser;
	var password;
	var storeName;
	return {
		login: function(data, done) {
		$http.post('/login', {email: data.email, password: data.password})
			.success(function(res) {
				currentUser = res.user;
				password = data.password;
				storeName = res.storeName;
				done(res.message, res.storeName);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
		},
		logout: function() {
			console.log('logout');
			currentUser = "";
			storeName = "";
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
		storeName: function() {
			return storeName;
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
		},
		password: function() {
			return password;
		}
	};
}]);


app.factory('Store', ['$http', '$location', 'AuthService', function($http, $location, AuthService) {
	var items;
	var storeName;
	return {
		update: function(data) {
			currentUser = data;
		},
		createItem: function(data, done) {
			$http.post('/createItem', 
				{email: AuthService.currentUser(), password: AuthService.password(), item: data})
				.success(function(res) {
					console.log(res);
					items = res.items;
					done(res.message);
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		},
		items: function(done) {
			if(!items)
			{
				$http.post('/getItems',
					{email: AuthService.currentUser(), password: AuthService.password()})
				.success(function(res) {
					console.log(res);
					items = res.items;
					done(items);
				})
				.error(function(data) {
					console.log("Error: " + data);
					done(items);
				});
			}
			done(items);
		}
	};
}]);

