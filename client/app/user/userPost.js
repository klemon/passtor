var userPost = angular.module('userPost', []);

userPost.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/userPost', {
    templateUrl:'app/user/userPost.tpl.html',
    controller: 'UserPostCtrl',
    resolve: userPost.resolve
  });
}])
	

.controller('UserPostCtrl', ['$scope', '$location', 'Posts', 'User', '$rootScope',
 function($scope, $location, Posts, User, $rootScope) {
	$scope.text = ""; // For the comment the user can make on the post
	$scope.post = $rootScope.post;
	$scope.comments = [];
	$scope.busy = false;
	$scope.lastDate = null;
	$scope.posts = new Posts();
	$scope.noMoreComments = false;
	$scope.timeToRefresh = false;
	$scope.prevTime = 0;
	$scope.edit = function() {
		$rootScope.post = $scope.post;
		$location.path('/editPost');
	}
	$scope.nextPage = function() {
		if($scope.noMoreComments) {
			var d = new Date();
			var currTime = d.getTime();
			if(currTime-$scope.prevTime > 10000) {
				$scope.timeToRefresh = true;
				$scope.prevTime = currTime;
			}
			else
				$scope.timeToRefresh = false;
		}
		if($scope.busy || ($scope.noMoreComments && !$scope.timeToRefresh))
			return;
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
	$scope.profile = function(username) {
		$rootScope.username = username;
		$location.path('/otherProfile');
	}
	$scope.userProfile = function() {
		$location.path('/userProfile');
	}
}]);