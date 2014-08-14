var sOItems = angular.module('sOItems', []);

sOItems.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/sOItems', {
    templateUrl:'app/storeowner/sOItems.tpl.html',
    controller: 'SOItemsCtrl',
    resolve: sOItems.resolve
  });
}]);



sOItems.controller('SOItemsCtrl', ['$scope', '$location', '$rootScope', 'Items',
 function($scope, $location, $rootScope, Items) {
	$scope.iF = new Items(false, true); // iF = Items Factory
	$scope.iF.showMore();
	$scope.edit = function(item) {
		$rootScope.item = item;
		$location.path('/editItem');
	}
	$scope.view = function(item) {
		$rootScope.item = item;
		$location.path('/sOItem');
	}
}]);