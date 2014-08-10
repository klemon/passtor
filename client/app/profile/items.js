var items = angular.module('items', []);

items.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/items', {
    templateUrl:'app/profile/items.tpl.html',
    controller: 'ItemsCtrl',
    resolve: items.resolve
  });
}]);

items.controller('ItemsCtrl', ['$scope', '$location','User', 'Posts', '$rootScope', 'Items',
 function($scope, $location, User, Posts, $rootScope, Items) {
	$scope.iF = new Items(false, false); // iF = Items Factory
	$scope.iF.showMore();
	$scope.view = function(item) {
		$rootScope.item = item;
		$location.path('/item');
	}
}]);