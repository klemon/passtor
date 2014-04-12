var editProfile = angular.module('editProfile', []);

editProfile.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/editProfile', {
    templateUrl:'app/profile/edit.tpl.ejs',
    controller: 'EditCtrl',
    resolve: editProfile.resolve
  });
}])
	

.controller('EditCtrl', ['$scope', function($scope) {
	$scope.test = 'Edit Profile';
	// $scope.test = function (){

	// };

}]);