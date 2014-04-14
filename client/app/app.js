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

.controller('HeaderCtrl', ['$scope', 'AuthService', '$http', function($scope, AuthService, $http){
	$scope.logout = function(){
		AuthService.logout();
	}
	
}]);

app.factory('AuthService', ['$http', function($http) {
	var currentUser;

	return {
		login: function(data) {
			// var request = $http.post('/login', {email: data.email, password: data.password});
			// return request.then(function(response) {
	  //       	currentUser = response.email;
	  //       	//return isAuthenticated();
   //    			});
		$http.post('/login', {email: data.email, password: data.password})
			.success(function(res) {
				console.log('Workerd?');
				currentUser = 'worked?';
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});

		},
		logout: function() {
			console.log('logout');
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
		isAuthenticated: function(){
      	return !!currentUser;
    	}
	};
}]);


