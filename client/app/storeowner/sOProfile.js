var sOProfile = angular.module('sOProfile', []);

sOProfile.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/sOProfile', {
    templateUrl:'app/storeowner/sOProfile.tpl.html',
    controller: 'SOProfileCtrl',
    resolve: sOProfile.resolve
  });
}])
	

.controller('SOProfileCtrl', ['$scope', 'User', '$location', function(sc, User, loc) {
	sc.user = User.currentUser();
	sc.editSOProfile = function() {
		loc.path('/editSOProfile');
	}
}]);