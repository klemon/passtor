var dashboard = angular.module('dashboard', []);

dashboard.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/dashboard', {
    templateUrl:'app/dashboard/dashboard.tpl.html',
    controller: 'DashboardCtrl',
    resolve: dashboard.resolve
  });
}]);



dashboard.controller('DashboardCtrl', ['$scope', '$location', 'User', 'User', 'Posts',
	function($scope, $location, User, User, Posts) {
	$scope.sorts = [{text: "Date added (newest - oldest)", id: 0}, {text: "Date added (oldest - newest)", id: 1},
	{text: "Most popular", id: 2}];
	$scope.selectedSort = $scope.sorts[0];
	$scope.prevSort = $scope.selectedSort;
	$scope.numPosts = 0;
	$scope.posts = [];
	$scope.lastDate = null;
	$scope.page = 0; // For Most Popular
	$scope.showMore = function() {
		User.send('/posts', {all: true, sort: $scope.selectedSort.id, lastDate: $scope.lastDate, page: $scope.page},
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
	$scope.profile = function(post) {
		User.setOtherUsername(post.creator);
		$location.path('/profile');
	}
}]);