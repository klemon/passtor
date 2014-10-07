var signup = angular.module('signup', []);

signup.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/signup', {
    templateUrl:'app/security/signup.tpl.html',
    resolve: signup.resolve
  });
}]);

signup.controller('SignupCtrl', ['$scope', '$location','User', 'focus', function($scope, $location, User, focus) {
	$scope.message = "";
	$scope.formData = {};
	$scope.signup = function(){
	    if(!$scope.formData.username) {
	      $scope.message = "Please provide a username.";
	      focus('username');
	      return;
	    }
	    var re = /^\w+$/;
	    if(!re.test($scope.formData.username)) {
	      $scope.message = "Username must contain only letters, numbers, and underscores.";
	      focus('username');
	      return;
	    }
	    if($scope.formData.password && $scope.formData.password == $scope.formData.password2) {
	      if($scope.formData.password.length < 6) {
	        $scope.message = "Password must contain at least six characters.";
	        focus('password');
	        return;
	      }
	      if($scope.formData.password == $scope.formData.username) {
	        $scope.message = "Password must be different from Username.";
	        $scope.formData.password.focus();
	        return;
	      }
	      re = /[0-9]/;
	      if(!re.test($scope.formData.password)) {
	        $scope.message = "Password must contain at least one number (0-9).";
	        focus('password');
	        return;
	      }
	      re = /[a-z]/;
	      if(!re.test($scope.formData.password)) {
	        $scope.message = "Password must contain at least one lowercase letter (a-z).";
	        focus('password');
	        return;
	      }
	      re = /[A-Z]/;
	      if(!re.test($scope.formData.password)) {
	        $scope.message = "Password must contain at least one uppercase letter (A-Z).";
	        focus('password');
	        return;
	      }
	    } else {
	      $scope.message = "Please check that you've entered and confirmed your password.";
	      focus('password');
	      return;
	    }
		if(!$scope.formData.email) {
			$scope.message = "Please provide an email.";
			focus('email');
			return;
		}
		User.send('/signup', $scope.formData, function(err, res) {
			$scope.message = res.message;
			if(!$scope.message)
				$location.path('/login');
		});
	}
}]);