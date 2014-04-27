var editItem = angular.module('editItem', []);

editItem.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/editItem', {
    templateUrl:'app/inventory/editItem.tpl.html',
    controller: 'EditItemCtrl',
    resolve: editItem.resolve
  });
}]);



editItem.controller('EditItemCtrl', ['$scope', '$location', '$http', 'Store', function($scope, $location, $http, Store) {
	$scope.formData = Store.getEditItem(); // name, description, coins, expires
	$scope.message;
	$scope.increment = function() {
		$scope.formData.cost += 1;
	}
	$scope.decrement = function() {
		$scope.formData.cost -= 1;
		if($scope.formData.cost < 1)
			$scope.formData.cost = 1;
	}
	$scope.editItem = function() {
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
		Store.editItem($scope.formData, function(message) {
			$scope.message =  message;
			if(!message)
				$location.path('/inventory');
		});
	}
}]);