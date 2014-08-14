var userItems = angular.module('userItems', []);

userItems.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/userItems', {
    templateUrl:'app/user/userItems.tpl.html',
    controller: 'UserItemsCtrl',
    resolve: userItems.resolve
  });
}]);

userItems.controller('UserItemsCtrl', ['$scope', '$location','User', 'Posts', '$rootScope', 'Items',
 function($scope, $location, User, Posts, $rootScope, Items) {
	$scope.iF = new Items(false, false); // iF = Items Factory
	$scope.iF.showMore();
	$scope.view = function(item) {
		$rootScope.item = item;
		$location.path('/userItem');
	}
	$scope.profile = function(storeName) {
		$rootScope.storeName = storeName;
		$location.path('/storeProfile');
	}
}]);