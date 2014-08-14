var storeItems = angular.module('storeItems', []);

storeItems.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/storeItems', {
    templateUrl:'app/store/storeItems.tpl.html',
    controller: 'StoreItemsCtrl',
    resolve: storeItems.resolve
  });
}]);

storeItems.controller('StoreItemsCtrl', ['$scope', '$location', 'Items', '$rootScope', 'User',
 function($scope, $location, Items, $rootScope, User) {
	$scope.iF = new Items(true, false); // iF = Items Factory
	User.send('/wishlistIds', {}, function(err, res) {
		$scope.wishlistIds = res.wishlistIds;
		$scope.showMore();
	});
	$scope.showMore = function() {
		$scope.iF.showMore(function() {
			for(var i = 0; i < $scope.iF.items.length; ++i) {
				$scope.iF.items[i].onWishlist = false;
				for(var j = 0; j < $scope.wishlistIds.length; ++j) {
					if($scope.wishlistIds[j] == $scope.iF.items[i].id) {
						$scope.iF.items[i].onWishlist = true;		
						break;
					}
				}
			}
		});
	}
	$scope.view = function(item) {
		$rootScope.item = item;
		$location.path('/storeItem');
	}
	$scope.addToWishlist = function(index) {
		User.send('/addToWishlist', {id: $scope.iF.items[index].id}, function(err, res) {
			$scope.iF.items[index].onWishlist = true;
		});
	}
	$scope.profile = function(storeName) {
		$rootScope.storeName = storeName;
		$location.path('/storeProfile');
	}
}]);