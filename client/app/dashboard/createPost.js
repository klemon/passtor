var createPost = angular.module('createPost', []);

createPost.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/createPost', {
    templateUrl:'app/dashboard/createPost.tpl.ejs',
    controller: 'CreateCtrl',
    resolve: createPost.resolve
  });
}])
	

.controller('CreateCtrl', ['$scope', '$location', 'AuthService', '$rootScope', 
	function($scope, $location, AuthService, $rootScope) {
	$scope.createNew = function() {
		AuthService.send('/createPost', $scope.formData, function(res) {
			$location.path('/dashboard');
		});
	};

}]);