var editSOProfile = angular.module('editSOProfile', []);

editSOProfile.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/editSOProfile', {
    templateUrl:'app/storeowner/editSOProfile.tpl.html',
    controller: 'EditSOProfileCtrl',
    resolve: editSOProfile.resolve
  });
}])
	

.controller('EditSOProfileCtrl', ['$scope', '$location', 'User',
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
				User.setUser(user);
				$location.path('/profile');
			}
		});
	};

}]);