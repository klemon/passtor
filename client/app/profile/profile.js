var profile = angular.module('profile', []);

profile.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/profile', {
    templateUrl:'app/profile/profile.tpl.ejs',
    controller: 'ProfileCtrl',
    resolve: profile.resolve
  });
}])
	

.controller('ProfileCtrl', ['$scope', '$http', 'AuthService', function($scope, $http, AuthService) {
	$scope.user;
	$http.get('/user', {
    params: { email: AuthService.currentUser() }
		})
		.success(function(data) {
			$scope.user = data.local;
		})
		.error(function(data) {
			console.log('Error: ' + data);
	});

	$scope.logout = function(){
		$http.get('./logout')
		.success(function() {
			$scope.test = 'LOGGEDOUT';
		})
		.error(function(data) {
			$scope.test = 'Already logged out';
			console.log('Error: ' + data);
		});
	};

}]);