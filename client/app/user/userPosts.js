var userPosts = angular.module('userPosts', []);

userPosts.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/userPosts', {
    templateUrl:'app/user/userPosts.tpl.html',
    controller: 'UserPostsCtrl',
    resolve: userPosts.resolve
  });
}])
	

.controller('UserPostsCtrl', ['$scope', 'User', 'Posts', '$location', '$rootScope',
 function($scope, User, Posts, $location, $rootScope) {
 	$scope.pF = new Posts(User.currentUser().username); // pF = postsFactory, pF name must be used
 	$scope.creator = User.currentUser().username;
	$scope.view = function(post) {
		$rootScope.post = post;
		$location.path('/userPost');
	}
	$scope.userProfile = function() {
		$location.path('/userProfile');
	}
}]);