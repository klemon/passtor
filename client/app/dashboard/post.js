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
	$scope.post = Posts.getPost();
	$scope.canEdit = ($scope.post.creator == User.currentUser().username);
	$scope.edit = function() {Posts.edit($scope.post);}
	$scope.profile = function(post) {
		User.setOtherUsername(post.creator);
		$location.path('/profile');
	}
}]);