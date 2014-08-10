var post = angular.module('post', []);

post.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/post', {
    templateUrl:'app/dashboard/post.tpl.html',
    controller: 'PostCtrl',
    resolve: post.resolve
  });
}])
	

.controller('PostCtrl', ['$scope', '$location', 'Posts', 'User', '$rootScope',
 function($scope, $location, Posts, User, $rootScope) {
	$scope.text = ""; // For the comment the user can make on the post
	$scope.post = $rootScope.post;
	$scope.comments = [];
	$scope.canEdit = ($scope.post.creator == User.currentUser().username);
	$scope.canLike = ($scope.post.creator != User.currentUser().username);
	$scope.busy = false;
	$scope.lastDate = null;
	$scope.posts = new Posts();
	$scope.edit = function() {
		$rootScope.post = $scope.post;
		$location.path('/editPost');
	}
	$scope.like = function() {
		User.send('/like', {text: $scope.text, postId: $scope.post.id}, function(err, res) {
			$scope.post = res.post;
			if(!$scope.comments.length)
				$scope.lastDate = res.comment.created
			var date = new Date(res.comment.created);
			res.comment.created = {month:Posts.monthToStr(date.getMonth()),
			 day:date.getDate(), year:date.getFullYear()};
			$scope.comments.unshift(res.comment);
			$scope.text = "";
		});
	}
	$scope.profile = function(data) {
		User.setOtherUsername(data.creator);
		$location.path('/profile');
	}
	$scope.nextPage = function() {
		if($scope.busy) return;
		$scope.busy = true;
		User.send('/comments', {postId: $scope.post.id, lastDate: $scope.lastDate}, function(err, res) {
			if(res.comments.length)
				$scope.lastDate = res.comments[res.comments.length-1].created;
			for(var i = 0; i < res.comments.length; ++i) {
				var date = new Date(res.comments[i].created);
				res.comments[i].created = {month:$scope.posts.monthToStr[date.getMonth()],
				 day:date.getDate(), year:date.getFullYear()};
				$scope.comments.push(res.comments[i]);
			}
			$scope.busy = false;
		});
	}
}]);