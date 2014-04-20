var createPost = angular.module('createPost', []);

createPost.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/createPost', {
    templateUrl:'app/dashboard/createPost.tpl.ejs',
    controller: 'CreateCtrl',
    resolve: createPost.resolve
  });
}])
	

.controller('CreateCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
	$formData = {};
	$scope.createNew = function() {
		$http.post('/createPost', $scope.formData)
			.success(function(data) {
				$location.path('/dashboard');
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

}]);