var profile = angular.module('profile', []);

profile.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/profile', {
    templateUrl:'app/profile/profile.tpl.html',
    controller: 'ProfileCtrl',
    resolve: profile.resolve
  });
}])
	

.controller('ProfileCtrl', ['$scope', 'User', function($scope, User) {
	$scope.canEdit = (User.otherUsername() == User.currentUser().username);
	$scope.isStoreOwner = false;
	if(!$scope.canEdit) {
		User.send('/user', {otherUsername: User.otherUsername()}, function(err, res) {
			if(err) {
				//
			} else {
				$scope.user = res.user;
			}
		})
	} else {
		$scope.isStoreOwner = User.currentUser().storeName;
		$scope.user = User.currentUser();
	}
	$scope.showItems = ($scope.canEdit && !$scope.isStoreOwner);
	$scope.edit = function() {Posts.edit($scope.post);}
}]);