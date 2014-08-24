var userItem = angular.module('userItem', []);

userItem.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/userItem', {
    templateUrl:'app/user/userItem.tpl.html',
    controller: 'UserItemCtrl',
    resolve: userItem.resolve
  });
}]);

userItem.controller('UserItemCtrl', ['$scope', '$location', 'User', '$rootScope', 
	function($scope, $location, User, $rootScope) {
	$scope.item = $rootScope.item;
	$scope.message;
	$scope.qrcode = $scope.item.QRCode.toUpperCase();
	$scope.buy = function() {
		if(User.currentUser().coins < $scope.item.cost) {
			$scope.message = "You don't have enough coins to buy this item.";
			return;
		}
		User.send('/buyItem', {id: $scope.item.id}, function(err, res) {
			User.addItem($scope.item.id);
			++$scope.item.num;
			++$scope.item.sold;
		});
	}
	$scope.profile = function(storeName) {
		$rootScope.storeName = storeName;
		$location.path('/storeProfile');
	}
}]);