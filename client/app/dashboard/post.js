var post = angular.module('post', []);

post.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/post', {
    templateUrl:'app/dashboard/post.tpl.html',
    controller: 'PostCtrl',
    resolve: post.resolve
  });
}])
	

.controller('PostCtrl', ['$scope', '$location', 'Posts', 'User',
 function($scope, $location, Posts, User) {
	$scope.text = ""; // For the comment the user can make on the post
	$scope.post = Posts.getPost();
	User.send('/comments', {postId: $scope.post.id}, function(err, res) {
		$scope.comments = res.comments;
	});
	$scope.canEdit = ($scope.post.creator == User.currentUser().username);
	$scope.canLike = ($scope.post.creator != User.currentUser().username);
	$scope.edit = function() {Posts.edit($scope.post);}
	$scope.like = function() {
		User.send('/like', {text: $scope.text, postId: $scope.post.id}, function(err, res) {
			$scope.post = res.post;
			$scope.comments.push(res.comment);
			$scope.text = "";
		});
	}
	$scope.profile = function(post) {
		User.setOtherUsername(post.creator);
		$location.path('/profile');
	}
	$scope.monthToStr = function(num) {
		return Posts.monthToStr(num);}
	$scope.profile = function(comment) {
		User.setOtherUsername(comment.creator);
		$location.path('/profile');
	}
}]);