var otherPost = angular.module('otherPost', []);

otherPost.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/otherPost', {
    templateUrl:'app/dashboard/otherPost.tpl.html',
    controller: 'OtherPostCtrl',
    resolve: otherPost.resolve
  });
}])
	

.controller('OtherPostCtrl', ['$scope', '$location', 'Posts', 'User', '$rootScope',
 function($scope, $location, Posts, User, $rootScope) {
	$scope.text = ""; // For the comment the user can make on the post
	$scope.post = $rootScope.post;
	$scope.comments = [];
	$scope.busy = false;
	$scope.lastDate = null;
	$scope.posts = new Posts();
	$scope.numLikesLeft = User.currentUser().likes;
	$scope.like = function() {
		User.send('/like', {text: $scope.text, postId: $scope.post.id}, function(err, res) {
			var postDate = new Date(res.post.created);
			res.post.created = {month:$scope.posts.monthToStr[postDate.getMonth()],
			 day:postDate.getDate(), year:postDate.getFullYear()};
			$scope.post = res.post;
			if(res.comment) {
				if(!$scope.comments.length)
					$scope.lastDate = res.comment.created
				var date = new Date(res.comment.created);
				res.comment.created = {month:$scope.posts.monthToStr[date.getMonth()],
				 day:date.getDate(), year:date.getFullYear()};
				$scope.comments.unshift(res.comment);
			}
			$scope.text = "";
		});
	}
	$scope.profile = function(username) {
		if(username == User.currentUser().username)
			$location.path('/userProfile');
		else {
			$rootScope.username = username;
			$location.path('/otherProfile');
		}
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