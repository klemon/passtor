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
	$scope.sorts = [{text: "Date added (newest - oldest)", id: 0}, {text: "Date added (oldest - newest)", id: 1},
	{text: "Most popular", id: 2}];
	$scope.selectedSort = $scope.sorts[0];
	$scope.prevSort = $scope.selectedSort;
	$scope.numPosts = 0;
	$scope.posts = [];
	$scope.lastDate = null;
	$scope.page = 0; // For Most Popular
	$scope.creator = User.otherUsername();
	$scope.showMore = function() {
		User.send('/posts', {username: User.otherUsername(), sort: $scope.selectedSort.id, lastDate: $scope.lastDate, page: $scope.page},
		 function(err, res) {
		 	if($scope.selectedSort.id == 2) {
		 		$scope.page = $scope.page + 1;
		 	} else if(res.posts.length) {
		 		$scope.lastDate = res.posts[res.posts.length-1].created;
		 	}
			$scope.numPosts = res.numPosts;
			for(var i = 0; i < res.posts.length; ++i) {
				var date = new Date(res.posts[i].created);
				res.posts[i].created = {month: Posts.monthToStr(date.getMonth()), day: date.getDate(), year: date.getFullYear()};
				$scope.posts.push(res.posts[i]);
			}
		});
	}
	$scope.changeSort = function() {
		if($scope.prevSort.id == $scope.selectedSort.id)
			return;
		$scope.prevSort = $scope.selectedSort;
		$scope.posts = [];
		$scope.lastDate = null;
		$scope.page = 0;
		$scope.showMore();
	}
	$scope.showMore();
	$scope.view = function(post) {Posts.view(post);}
	$scope.monthToStr = function(num) {return Posts.monthToStr(num);}
	$scope.profile = function(post) {
		User.setOtherUsername(post.creator);
		$location.path('/profile');
	}
}]);