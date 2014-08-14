var createPost = angular.module('createPost', []);

createPost.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/createPost', {
    templateUrl:'app/user/createPost.tpl.html',
    controller: 'CreateCtrl',
    resolve: createPost.resolve
  });
}])
	

.controller('CreateCtrl', ['$scope', '$location', 'User', '$rootScope', 
	function($scope, $location, User, $rootScope) {
		$scope.message = "";
		$scope.formData = {};
	$scope.createNew = function() {
		if(!$scope.formData.title) {
			$scope.message = "The post needs a title.";
			return;
		} else if(!$scope.formData.description) {
			$scope.message = "The post needs a description.";
			return;
		}
		User.send('/createPost', $scope.formData, function(res) {
			$location.path('/posts');
		});
	};
}]);