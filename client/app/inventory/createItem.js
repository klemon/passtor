var createItem = angular.module('createItem', []);

createItem.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/createItem', {
    templateUrl:'app/inventory/createItem.tpl.html',
    controller: 'CreateItemCtrl',
    resolve: createItem.resolve
  });
}]);



createItem.controller('CreateItemCtrl', ['$scope', '$location', 'User', function($scope, $location, User) {
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
		User.send('/createItem', $scope.formData, function(err, res) {
			$scope.message = res.message;
			if(!$scope.message)
				$location.path('/inventory');
		});
	}
}]);