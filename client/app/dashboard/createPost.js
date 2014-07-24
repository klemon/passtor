var createPost = angular.module('createPost', []);

createPost.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/createPost', {
    templateUrl:'app/dashboard/createPost.tpl.html',
    controller: 'CreateCtrl',
    resolve: createPost.resolve
  });
}])
	

.controller('CreateCtrl', ['$scope', '$location', 'User', '$rootScope', 
	function($scope, $location, User, $rootScope) {
	$scope.createNew = function() {
		User.send('/createPost', $scope.formData, function(res) {
			$location.path('/dashboard');
		});
	};

}]);