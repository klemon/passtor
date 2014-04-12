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
	$scope.createPost = function() {
		$http.post('/createPost', $scope.formData)
			.success(function(data) {
				
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

}]);