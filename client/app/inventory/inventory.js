var inventory = angular.module('inventory', []);

inventory.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/inventory', {
    templateUrl:'app/inventory/inventory.tpl.html',
    controller: 'InventoryCtrl',
    resolve: inventory.resolve
  });
}]);



inventory.controller('InventoryCtrl', ['$scope', '$location', '$rootScope', 'Items',
 function($scope, $location, $rootScope, Items) {
	$scope.iF = new Items(false, true); // iF = Items Factory
	$scope.iF.showMore();
	$scope.edit = function(item) {
		$rootScope.item = item;
		$location.path('/editItem');
	}
	$scope.view = function(item) {
		$rootScope.item = item;
		$location.path('/item');
	}
}]);