var posts = angular.module('posts', []);

posts.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/posts', {
    templateUrl:'app/profile/posts.tpl.html',
    controller: 'PostsCtrl',
    resolve: posts.resolve
  });
}])
	

.controller('PostsCtrl', ['$scope', 'User', 'Posts', '$location',
 function($scope, User, Posts, $location) {
	User.send('/posts', {username: User.otherUsername()}, function(err, res) {
		$scope.posts = res.posts;
	});
	$scope.monthToStr = function(num) {return Posts.monthToStr(num);}
	$scope.view = function(post) {Posts.view(post);}
	$scope.profile = function(post){
		User.setOtherUsername(post.creator);
		$location.path('/profile');
	}
}]);