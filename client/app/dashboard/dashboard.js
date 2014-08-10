var dashboard = angular.module('dashboard', []);

dashboard.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/dashboard', {
    templateUrl:'app/dashboard/dashboard.tpl.html',
    controller: 'DashboardCtrl',
    resolve: dashboard.resolve
  });
}]);



dashboard.controller('DashboardCtrl', ['$scope', '$location', 'User', '$rootScope', 'Posts',
	function($scope, $location, User, $rootScope, Posts) {
 	$scope.pF = new Posts(null); // pF = postsFactory
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