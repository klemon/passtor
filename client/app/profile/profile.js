var profile = angular.module('profile', []);

profile.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/profile', {
    templateUrl:'app/profile/profile.tpl.ejs',
    controller: 'ProfileCtrl',
    resolve: profile.resolve
  });
}])
	

.controller('ProfileCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.test = 'Edit Profile';
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