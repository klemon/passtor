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
	User.send('/posts', {all: true}, function(err, res) {
		$scope.posts = res.posts;
	});
	$scope.view = function(post) {Posts.view(post);}
	$scope.monthToStr = function(num) {return Posts.monthToStr(num);}
	$scope.profile = function(post) {
		User.setOtherUsername(post.creator);
		$location.path('/profile');
	}
}]);