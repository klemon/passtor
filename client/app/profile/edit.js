var editProfile = angular.module('editProfile', []);

editProfile.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/editProfile', {
    templateUrl:'app/profile/edit.tpl.ejs',
    controller: 'EditCtrl',
    resolve: editProfile.resolve
  });
}])
	

.controller('EditCtrl', ['$scope', '$http', '$location', 'AuthService', function($scope, $http, $location, AuthService) {
	$scope.test = 'Edit Profile';
	$scope.userAttributes = {curEmail: AuthService.currentUser()};
	$scope.update = function (userAttributes){
		$http.post('/updateProfile', $scope.userAttributes)
			.success(function(data) {
				console.log(data);
				$location.path('/profile');
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

}]);