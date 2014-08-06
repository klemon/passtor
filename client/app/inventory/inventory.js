var inventory = angular.module('inventory', []);

inventory.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/inventory', {
    templateUrl:'app/inventory/inventory.tpl.html',
    controller: 'InventoryCtrl',
    resolve: inventory.resolve
  });
}]);



inventory.controller('InventoryCtrl', ['$scope', '$location','User', 'Posts', '$rootScope',
 function($scope, $location, User, Posts, $rootScope) {
	$scope.sorts = [{text: "Date added (newest - oldest)", id: 0}, {text: "Date added (oldest - newest)", id: 1},
	{text: "Most sold", id: 2}, {text: "Most redeemed", id:3}];
	$scope.selectedSort = $scope.sorts[0];
	$scope.prevSort = $scope.selectedSort;
	$scope.numItems = 0;
	$scope.items = [];
	$scope.lastDate = null;
	$scope.page = 0; // For Most sold/redeemed

	$scope.showMore = function() {
		User.send('/items', {StoreOwner: User.currentUser().id, sort: $scope.selectedSort.id, 
			lastDate: $scope.lastDate, page: $scope.page}, function(err, res) {
		 	if($scope.selectedSort.id > 1) {
		 		$scope.page = $scope.page + 1;
		 	} else if(res.items.length) {
		 		$scope.lastDate = res.items[res.items.length-1].created;
		 	}
			$scope.numItems = res.numItems;
			for(var i = 0; i < res.items.length; ++i) {
				var date = new Date(res.items[i].created);
				res.items[i].created = {month: Posts.monthToStr(date.getMonth()), day: date.getDate(), year: date.getFullYear()};
				$scope.items.push(res.items[i]);
			}
		});
	}
	$scope.changeSort = function() {
		if($scope.prevSort.id == $scope.selectedSort.id)
			return;
		$scope.prevSort = $scope.selectedSort;
		$scope.items = [];
		$scope.lastDate = null;
		$scope.page = 0;
		$scope.showMore();
	}
	$scope.showMore();
	$scope.edit = function(item) {
		$rootScope.item = item;
		$location.path('/editItem');
	}
	$scope.delete = function(index) {
		User.send('/deleteItem', {id: $scope.items[index].id}, function(err, res) {
			$scope.items.splice(index, 1);
			$scope.numItems = $scope.numItems - 1;
		});
	}
}]);