var editProfile = angular.module('editProfile', []);

editProfile.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/editProfile', {
    templateUrl:'app/profile/edit.tpl.html',
    controller: 'EditCtrl',
    resolve: editProfile.resolve
  });
}])
	

.controller('EditCtrl', ['$scope', '$location', 'AuthService', 'User',
 function($scope, $location, AuthService, User) {
	$scope.userAttributes = User.currentUser();
	$scope.message = "";
	$scope.update = function (userAttributes){
		if(!$scope.userAttributes.email) {
			$scope.message = "Please provide an email.";
			return;
		}
		AuthService.send('/updateProfile', $scope.userAttributes, function(err, res) {
			if(res.message) {
				$scope.message = res.message;
				return;
			} else {
				User.setUser(res.user);
				$location.path('/profile');
			}
		});
	};

}]);