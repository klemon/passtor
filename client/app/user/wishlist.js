var wishlist = angular.module('wishlist', []);

wishlist.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/wishlist', {
    templateUrl:'app/user/wishlist.tpl.html',
    controller: 'WishlistCtrl',
    resolve: wishlist.resolve
  });
}]);

wishlist.controller('WishlistCtrl', ['$scope', '$location', '$rootScope', 'Items', 'User',
 function($scope, $location, $rootScope, Items, User) {
	$scope.iF = new Items(false, '/wishlist'); // iF = Items Factory, iF name must be used
	$scope.view = function(item) {
		$rootScope.item = item;
		$location.path('/wishItem');
	}
	$scope.profile = function(storeName) {
		$rootScope.storeName = storeName;
		$location.path('/storeProfile');
	}
	$scope.remove = function(index) {
		User.send('/removeFromWishlist', {id: $scope.iF.items[index].id}, function(err, res) {
			$scope.iF.items.splice(index, 1);
			--$scope.iF.numItems;
		});
	}
}]);