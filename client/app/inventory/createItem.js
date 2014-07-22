var createItem = angular.module('createItem', []);

createItem.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/createItem', {
    templateUrl:'app/inventory/createItem.tpl.html',
    controller: 'CreateItemCtrl',
    resolve: createItem.resolve
  });
}]);



createItem.controller('CreateItemCtrl', ['$scope', '$location', 'Store', function($scope, $location, Store) {
	$scope.formData = {cost : 1} // name, description, coins, expires
	$scope.message;
	$scope.increment = function() {
		$scope.formData.cost += 1; 
	}
	$scope.decrement = function() {
		$scope.formData.cost -= 1;
		if($scope.formData.cost < 1)
			$scope.formData.cost = 1;
	}
	$scope.createItem = function() {
		$scope.message = "";
		if(!$scope.formData.name)
		{
			$scope.message = "The item must have a name.";
			return;
		}
		if(!$scope.formData.description)
		{
			$scope.message = "The item must have a description.";
			return;
		}
		Store.createItem($scope.formData, function(message) {
			$scope.message =  message;
			if(!message)
				$location.path('/inventory');
		});
	}
}]);