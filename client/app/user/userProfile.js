var userProfile = angular.module('userProfile', []);

userProfile.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/userProfile', {
    templateUrl:'app/user/userProfile.tpl.html',
    controller: 'UserProfileCtrl',
    resolve: userProfile.resolve
  });
}])
	

.controller('UserProfileCtrl', ['$scope', 'User', function($scope, User) {
	$scope.user = User.currentUser();
}]);