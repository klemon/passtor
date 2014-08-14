var otherProfile = angular.module('otherProfile', []);

otherProfile.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/otherProfile', {
    templateUrl:'app/dashboard/otherProfile.tpl.html',
    controller: 'OtherProfileCtrl',
    resolve: otherProfile.resolve
  });
}])
	

.controller('OtherProfileCtrl', ['$scope', 'User', '$rootScope', '$location', function($scope, User, $rootScope, $location) {
	User.send('/user', {otherUsername: $rootScope.username}, function(err, res) {
			$scope.user = res.user;
	});
	$scope.viewPosts = function() {
		$rootScope.username = $scope.user.username;
		$location.path('/otherPosts');
	}
}]);