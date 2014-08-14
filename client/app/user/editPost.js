var editPost = angular.module('editPost', []);

editPost.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/editPost', {
    templateUrl:'app/user/editPost.tpl.html',
    controller: 'EditPostCtrl',
    resolve: editPost.resolve
  });
}])
	

.controller('EditPostCtrl', ['$scope', '$location', 'User', 'Posts', '$rootScope',
	function($scope, $location, User, Posts, $rootScope) {
	$scope.formData = $rootScope.post;
	$scope.message = "";
	$scope.edit = function() {
		if(!$scope.formData.edit) {
			$scope.message = "There are no changes to submit.";
			return;
		}
		User.send('/editPost', $scope.formData, function(err, res) {
			$rootScope.post = res.post;
			$location.path('/userPost');
		});
	}
}]);