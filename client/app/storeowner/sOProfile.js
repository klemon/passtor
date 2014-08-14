var sOProfile = angular.module('sOProfile', []);

sOProfile.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/sOProfile', {
    templateUrl:'app/storeowner/sOProfile.tpl.html',
    controller: 'SOProfileCtrl',
    resolve: sOProfile.resolve
  });
}])
	

.controller('SOProfileCtrl', ['$scope', 'User', '$rootScope', function($scope, User, $rootScope) {
	$scope.user = User.currentUser();
}]);