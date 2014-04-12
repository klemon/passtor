var app = angular.module('app', [
	'ngRoute',
	'dashboard',
	'store',
	'login',
	'signup',
	'profile',
	'editProfile',
	'createPost'
	]);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  
  $routeProvider.otherwise({redirectTo:'/'});
  $locationProvider.html5Mode(true);
  
  }])
.controller('AppCtrl', ['$scope', function($scope) {

}])

.controller('HeaderCtrl', ['$scope', '$http', function($scope, $http){
	
	
}]);

app.factory('AuthService', ['$http', function($http) {
	var currentUser;

	return {
		login: function(email, password) {
			var request = $http.post('/login', {email: email, password: password});
			return request.then(function(response) {
	        	currentUser = response.data.user;
	        	return isAuthenticated();
      			});
		},
		logout: function() {

		},
		isLoggedIn: function() {

		},
		currentUser: function() { 
			return currentUser; 
		},
		isAuthenticated: function(){
      	return !!currentUser;
    	}
	};
}]);


