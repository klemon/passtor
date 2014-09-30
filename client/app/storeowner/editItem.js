var editItem = angular.module('editItem', []);

editItem.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/editItem', {
    templateUrl:'app/storeowner/editItem.tpl.html',
    controller: 'EditItemCtrl',
    resolve: editItem.resolve
  });
}]);



editItem.controller('EditItemCtrl', ['$scope', '$location', 'User', '$rootScope',
 function($scope, $location, User, $rootScope) {
	$scope.formData = $rootScope.item;
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
		User.send('/editItem', $scope.formData, function(err, res) {
			if(res.message)
				$scope.message = res.message;
			else 
				$location.path('/sOItems');
		});
	}
	$scope.sOItems = function() {
		$location.path('/sOItems')
	}
}]);