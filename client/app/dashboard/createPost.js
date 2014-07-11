var createPost = angular.module('createPost', []);

createPost.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/createPost', {
    templateUrl:'app/dashboard/createPost.tpl.ejs',
    controller: 'CreateCtrl',
    resolve: createPost.resolve
  });
}])
	

.controller('CreateCtrl', ['$scope', '$http', '$location', 'AuthService', function($scope, $http, $location, AuthService) {
	var d = new Date();
	var year = d.getFullYear();
	var month = d.getMonth() + 1;
	if (month < 10)
		month = "0" + month;
	var day = d.getDate();
	$scope.data = year + "-" + month + "-" + day;
	console.log(" )) ");
	$scope.formData = {creator: AuthService.currentUser(), created: $scope.date,
	password: AuthService.password()};
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