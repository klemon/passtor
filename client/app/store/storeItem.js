var storeItem = angular.module('storeItem', []);

storeItem.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/storeItem', {
    templateUrl:'app/store/storeItem.tpl.html',
    controller: 'StoreItemCtrl',
    resolve: storeItem.resolve
  });
}]);

storeItem.controller('StoreItemCtrl', ['$scope', '$location', 'User', '$rootScope', 
	function($scope, $location, User, $rootScope) {
	$scope.item = $rootScope.item;
	$scope.message;
	$scope.buy = function() {
		if(User.currentUser().coins < $scope.item.cost) {
			$scope.message = "You don't have enough coins to buy this item.";
			return;
		}
		User.send('/buyItem', {id: $scope.item.id}, function(err, res) {
			User.addItem($scope.item.id);
			$location.path('/storeItems');
		});
	}
	$scope.profile = function(storeName) {
		$rootScope.storeName = storeName;
		$location.path('/storeProfile');
	}
}]);