var createItem = angular.module('createItem', []);

createItem.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/createItem', {
    templateUrl:'app/inventory/createItem.tpl.html',
    controller: 'CreateItemCtrl',
    resolve: createItem.resolve
  });
}]);



createItem.controller('CreateItemCtrl', ['$scope', '$location','AuthService', function($scope, $location, AuthService) {
	$scope.cancel = function() {
		$location.path('/inventory');
	}

}]);