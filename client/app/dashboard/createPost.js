var createPost = angular.module('createPost', []);

createPost.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/createPost', {
    templateUrl:'app/dashboard/createPost.tpl.ejs',
    controller: 'CreateCtrl',
    resolve: createPost.resolve
  });
}])
	

.controller('CreateCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.test = 'Edit Profile';
	$formData = {};
	$scope.createNew = function() {
		$http.post('/createPost', $scope.formData)
			.success(function(data) {
				$scope.posts = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

}]);