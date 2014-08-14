var storeProfile = angular.module('storeProfile', []);

storeProfile.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/storeProfile', {
    templateUrl:'app/store/storeProfile.tpl.html',
    controller: 'StoreProfileCtrl',
    resolve: storeProfile.resolve
  });
}])
	

.controller('StoreProfileCtrl', ['$scope', 'User', '$rootScope', function($scope, User, $rootScope) {
	User.send('/storeOwner', {storeName: $rootScope.storeName}, function(err, res) {
		$scope.storeOwner = res.storeOwner;
	});
}]);