var posts = angular.module('posts', []);

posts.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/posts', {
    templateUrl:'app/profile/posts.tpl.html',
    controller: 'PostsCtrl',
    resolve: posts.resolve
  });
}])
	

.controller('PostsCtrl', ['$scope', 'User', 'Posts', '$location', '$rootScope',
 function($scope, User, Posts, $location, $rootScope) {
 	$scope.pF = new Posts(User.otherUsername()); // pF = postsFactory
 	$scope.creator = User.otherUsername();
	$scope.view = function(post) {
		$rootScope.post = post;
		$location.path('/post');
	}
	$scope.profile = function(post) {
		User.setOtherUsername(post.creator);
		$location.path('/profile');
	}
	$scope.pF.showMore();
}]);