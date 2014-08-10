var store = angular.module('store', []);

store.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/store', {
    templateUrl:'app/store/store.tpl.html',
    controller: 'StoreCtrl',
    resolve: store.resolve
  });
}]);

store.controller('StoreCtrl', ['$scope', '$location', 'Items', '$rootScope',
 function($scope, $location, Items, $rootScope) {
	$scope.iF = new Items(true, false); // iF = Items Factory
	$scope.iF.showMore();
	$scope.view = function(item) {
		$rootScope.item = item;
		$location.path('/item');
	}
}]);