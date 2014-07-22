var editPost = angular.module('editPost', []);

editPost.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/editPost', {
    templateUrl:'app/dashboard/editPost.tpl.html',
    controller: 'EditPostCtrl',
    resolve: editPost.resolve
  });
}])
	

.controller('EditPostCtrl', ['$scope', '$location', 'AuthService', 'Posts',
	function($scope, $location, AuthService, Posts) {
	$scope.formData = Posts.getPost();
	$scope.message = "";
	$scope.edit = function() {
		if(!$scope.formData.edit) {
			$scope.message = "There are no changes to submit.";
			return;
		}
		AuthService.send('/editPost', $scope.formData, function(err, res) {
			if(err) {
				$scope.message = err;
				return;
			} else {
				Posts.view(res.post);
			}
		});
	}
}]);