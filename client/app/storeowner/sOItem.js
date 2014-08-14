var sOItem = angular.module('sOItem', []);

sOItem.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/sOItem', {
    templateUrl:'app/storeowner/sOItem.tpl.html',
    controller: 'SOItemCtrl',
    resolve: sOItem.resolve
  });
}]);

sOItem.controller('SOItemCtrl', ['$scope', '$location', 'User', '$rootScope', 
	function($scope, $location, User, $rootScope) {
	$scope.item = $rootScope.item;
	$scope.message;
	$scope.edit = function() {
		$rootScope.item = $scope.item;
		$location.path('/editSOItem');
	}
}]);