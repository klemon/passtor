var userProfile = angular.module('userProfile', []);

userProfile.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/userProfile', {
    templateUrl:'app/user/userProfile.tpl.html',
    controller: 'UserProfileCtrl',
    resolve: userProfile.resolve
  });
}])
	

.controller('UserProfileCtrl', ['$scope', 'User', '$location', function($scope, User, $location) {
	$scope.user = User.currentUser();
	$scope.editProfile = function() {
		$location.path('/editProfile');
	}
	$scope.userPosts = function() {
		$location.path('/userPosts');
	}
	$scope.userItems = function() {
		$location.path('/userItems');
	}
	$scope.wishlist = function() {
		$location.path('/wishlist');
	}
}]);