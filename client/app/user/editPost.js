var editPost = angular.module('editPost', []);

editPost.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/editPost', {
    templateUrl:'app/user/editPost.tpl.html',
    controller: 'EditPostCtrl',
    resolve: editPost.resolve
  });
}])
	

.controller('EditPostCtrl', ['$scope', '$location', 'User', 'Posts', '$rootScope', 'MyDate',
	function($scope, $location, User, Posts, $rootScope, MyDate) {
	$scope.formData = $rootScope.post;
	$scope.message = "";
	$scope.edit = function() {
		if(!$scope.formData.edit) {
			$scope.message = "There are no changes to submit.";
			return;
		}
		User.send('/editPost', $scope.formData, function(err, res) {
			res.post.created = MyDate.date(res.post.created);
			$rootScope.post = res.post;
			$location.path('/userPost');
		});
	}
}]);