var item = angular.module('item', []);

item.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/item', {
    templateUrl:'app/inventory/item.tpl.html',
    controller: 'ItemCtrl',
    resolve: item.resolve
  });
}]);

item.controller('ItemCtrl', ['$scope', '$location', 'User', '$rootScope', 
	function($scope, $location, User, $rootScope) {
	$scope.canBuy = (!User.currentUser().storeName && User.currentUser().username);
	$scope.item = $rootScope.item;
	$scope.canEdit = User.currentUser().storeName == $scope.item.storeName;
	$scope.message;
	$scope.edit = function() {
		$rootScope.item = $scope.item;
		$location.path('/editItem');
	}
	$scope.buy = function() {
		if(User.currentUser().coins < $scope.item.cost) {
			$scope.message = "You don't have enough coins to buy this item.";
			return;
		}
		User.send('/buyItem', {id: $scope.item.id}, function(err, res) {
			User.addItem($scope.item.id);
			$location.path('/store');
		});
	}
}]);