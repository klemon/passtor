var profile = angular.module('profile', []);

profile.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/profile', {
    templateUrl:'app/profile/profile.tpl.html',
    controller: 'ProfileCtrl',
    resolve: profile.resolve
  });
}])
	

.controller('ProfileCtrl', ['$scope', 'User', 'AuthService', function($scope, User, AuthService) {
	$scope.canEdit = (User.otherUsername() == User.currentUser().username);
	if(!$scope.canEdit) {
		AuthService.send('/user', {otherUsername: User.otherUsername()}, function(err, res) {
			if(err) {
				//
			} else {
				$scope.user = res.user;
			}
		})
	} else {
		$scope.user = User.currentUser();
	}
	$scope.edit = function() {Posts.edit($scope.post);}
}]);