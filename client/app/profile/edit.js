var editProfile = angular.module('editProfile', []);

editProfile.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/editProfile', {
    templateUrl:'app/profile/edit.tpl.html',
    controller: 'EditCtrl',
    resolve: editProfile.resolve
  });
}])
	

.controller('EditCtrl', ['$scope', '$location', 'User',
 function($scope, $location, User) {
	$scope.userAttributes = User.currentUser();
	$scope.message = "";
	$scope.update = function (userAttributes){
		if(!$scope.userAttributes.email) {
			$scope.message = "Please provide an email.";
			return;
		}
		User.send('/updateProfile', $scope.userAttributes, function(err, res) {
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