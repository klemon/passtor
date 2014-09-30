var otherPosts = angular.module('otherPosts', []);

otherPosts.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/otherPosts', {
    templateUrl:'app/dashboard/otherPosts.tpl.html',
    controller: 'OtherPostsCtrl',
    resolve: otherPosts.resolve
  });
}])
	

.controller('OtherPostsCtrl', ['$scope', 'User', 'Posts', '$location', '$rootScope',
 function($scope, User, Posts, $location, $rootScope) {
 	$scope.pF = new Posts($rootScope.username); // pF = postsFactory, pF name must be used
 	$scope.creator = $rootScope.username;
	$scope.view = function(post) {
		$rootScope.post = post;
		$location.path('/otherPost');
	}
	$scope.profile = function(post) {
		$rootScope.username = post.creator;
		$location.path('/otherProfile');
	}
	$scope.pF.showMore();
}]);