var dashboard = angular.module('dashboard', []);

dashboard.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/dashboard', {
    templateUrl:'app/dashboard/dashboard.tpl.ejs',
    controller: 'DashboardCtrl',
    resolve: dashboard.resolve
  });
}]);



dashboard.controller('DashboardCtrl', ['$scope', '$http', '$location', '$rootScope', function($scope, $http,
 $location, $rootScope) {
	$http.get('/posts')
		.success(function(data) {
			$scope.posts = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
	});

	// delete a todo after checking it
	$scope.view = function(id) {
		$rootScope.postID = id;
		$location.path('/loadPost');
	};
}]);