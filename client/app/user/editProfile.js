var editProfile = angular.module('editProfile', []);

editProfile.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/editProfile', {
    templateUrl:'app/user/editProfile.tpl.html',
    controller: 'ProfileEditCtrl',
    resolve: editProfile.resolve
  });
}])
	

.controller('ProfileEditCtrl', ['$scope', '$location', 'User',
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
				User.setUser(res);
				$location.path('/userProfile');
			}
		});
	};

}]);