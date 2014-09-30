var login = angular.module('login', []);

login.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl:'app/security/login.tpl.html',
    resolve: login.resolve
  });
}]);

login.controller('LoginCtrl', ['$scope', '$rootScope', '$location','AuthService', 'User',
 function($scope, $rootScope, $location, AuthService, User) {
	$scope.message;
	$scope.formData = {};
	
	$scope.login = function() {
		if(!$scope.formData.username)
		{
			$scope.message = "Please provide an username.";
			return;
		}
		else if(!$scope.formData.password)
		{
			$scope.message = "Please provide a password.";
			return;
		}
		User.send('/login', $scope.formData, function(err, res){
			if(err)
				$scope.message = err;
			else if(res.message) {
				console.log("res.messsage: " + res.messsage);
				$scope.message = res.message;
				$location.path('/login');
			} else {
				User.setUser(res);
				$rootScope.$broadcast('loggedIn');
				AuthService.setToken(res.token, res.expires);
				if(res.storeOwner) {
					$location.path('/sOItems');
				} else {
					$location.path('/posts');
				}
			}
		});
	}
}]);
/*

login: function(data, done) {
		$http.post('/login', data)
			.success(function(res) {
				$rootScope.username = data.username;
				$window.localStorage.setItem('username', $rootScope.username);
				$rootScope.password = data.password;
				$window.localStorage.setItem('password', $rootScope.password);
				$rootScope.storeName = res.storeName;
				$rootScope.firstName = res.firstName;
				$rootScope.lastName = res.lastName;
				$rootScope.coins = res.coins;
				$rootScope.likes = res.likes;
				$rootScope.email  = res.email;
				expires = res.expires;
				$rootScope.token = res.token;
				$window.localStorage.setItem('token', $rootScope.token);

			if(storeName) {
				console.log("to the store");
				$location.path('/inventory');
			}
			else if(!res.message) {
				console.log("to the dashboard");
				$location.path('/dashboard');
			} else {
				console.log("res.messsage: " + res.messsage);
				$location.path('/login');
			}

				done(res.message);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
		},*/