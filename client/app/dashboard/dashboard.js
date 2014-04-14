var dashboard = angular.module('dashboard', []);

dashboard.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/dashboard', {
    templateUrl:'app/dashboard/dashboard.tpl.ejs',
    controller: 'DashboardCtrl',
    resolve: dashboard.resolve
  });
}]);



dashboard.controller('DashboardCtrl', ['$scope', '$http', function($scope, $http) {
	$http.get('/posts')
		.success(function(data) {
			$scope.posts = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
	});
}]);