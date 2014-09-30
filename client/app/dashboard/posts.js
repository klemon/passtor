var posts = angular.module('posts', []);

posts.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/posts', {
    templateUrl:'app/dashboard/posts.tpl.html',
    controller: 'PostsCtrl',
    resolve: posts.resolve
  });
}]);

posts.controller('PostsCtrl', ['$scope', '$location', 'User', '$rootScope', 'Posts',
	function($scope, $location, User, $rootScope, Posts) {
 	$scope.pF = new Posts(null); // pF = postsFactory, must use pF as name
	$scope.view = function(post) {
		$rootScope.post = post;
		if(post.creator == User.currentUser().username)
			$location.path('/userPost');
		else
			$location.path('/otherPost');
	}
	$scope.profile = function(username) {
		$rootScope.username = username;
		if(username == User.currentUser().username)
			$location.path('/userProfile');
		else
			$location.path('/otherProfile');
	}
	$scope.pF.showMore();
}]);