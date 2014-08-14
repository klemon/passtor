var wishItem = angular.module('wishItem', []);

wishItem.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/wishItem', {
    templateUrl:'app/user/wishItem.tpl.html',
    controller: 'WishItemCtrl',
    resolve: wishItem.resolve
  });
}]);

wishItem.controller('WishItemCtrl', ['$scope', '$location', 'User', '$rootScope', 
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
			
		});
	}
	$scope.profile = function(storeName) {
		$rootScope.storeName = storeName;
		$location.path('/storeProfile');
	}
}]);