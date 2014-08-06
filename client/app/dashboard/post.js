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
	$scope.comments = [];
	/*User.send('/comments', {postId: $scope.post.id}, function(err, res) {
		$scope.comments = res.comments;
		for(var i = 0; i < $scope.comments.length; ++i) {
			var date = new Date($scope.comments[i].created);
			$scope.comments[i].created = {month: Posts.monthToStr(date.getMonth()),
				day: date.getDate(), year: date.getFullYear()};
		}
	});*/
	$scope.canEdit = ($scope.post.creator == User.currentUser().username);
	$scope.canLike = ($scope.post.creator != User.currentUser().username);
	$scope.busy = false;
	$scope.lastDate = null;
	$scope.edit = function() {Posts.edit($scope.post);}
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
				res.comments[i].created = {month:Posts.monthToStr(date.getMonth()),
				 day:date.getDate(), year:date.getFullYear()};
				$scope.comments.push(res.comments[i]);
			}
			$scope.busy = false;
		});
	}
}]);