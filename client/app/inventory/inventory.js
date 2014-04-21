var inventory = angular.module('inventory', []);

inventory.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/inventory', {
    templateUrl:'app/inventory/inventory.tpl.html',
    controller: 'InventoryCtrl',
    resolve: inventory.resolve
  });
}]);



inventory.controller('InventoryCtrl', ['$scope', '$location','Store', function($scope, $location, Store) {
	$scope.items;
	Store.items(function(items) {
		console.log("retrieving items");
		$scope.items = items;
		console.log(items);
	})
}]);