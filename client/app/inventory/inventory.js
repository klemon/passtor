var inventory = angular.module('inventory', []);

inventory.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/inventory', {
    templateUrl:'app/inventory/inventory.tpl.html',
    controller: 'InventoryCtrl',
    resolve: inventory.resolve
  });
}]);



inventory.controller('InventoryCtrl', ['$scope', '$location','AuthService', function($scope, $location, AuthService) {
	

}]);