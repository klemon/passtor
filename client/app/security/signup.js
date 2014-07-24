var signup = angular.module('signup', []);

signup.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/signup', {
    templateUrl:'app/security/signup.tpl.ejs',
    resolve: signup.resolve
  });
}]);



signup.controller('SignupCtrl', ['$scope', '$location','User', function($scope, $location, User) {
	$scope.message = "";
	$scope.formData = {};
	$scope.signup = function(){
		if(!$scope.formData.username) {
			$scope.message = "Please provide an username.";
			return;
		} else if(!$scope.formData.password) {
			$scope.message = "Please provide a password.";
			return;
		} else if(!$scope.formData.email) {
			$scope.message = "Please provide an email.";
			return;
		}
		User.send('/signup', $scope.formData, function(err, res) {
			$scope.message = res.message;
			if(!$scope.message)
				$location.path('/login');
		});
	}
}]);
/*
		signup: function(data, done) {
			
		$http.post('/signup', {username: data.username,
								password: data.password,
								email: data.email,
								firstName: data.firstName,
								lastName: data.lastName})
			.success(function(res) {
				done(res.message);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
		}*/