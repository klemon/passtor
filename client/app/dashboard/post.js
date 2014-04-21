var post = angular.module('post', []);

post.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/loadPost', {
    templateUrl:'app/dashboard/post.tpl.ejs',
    controller: 'PostCtrl',
    resolve: post.resolve
  });
}])
	

.controller('PostCtrl', ['$scope', '$http', '$location', '$rootScope', function($scope, $http, $location, $rootScope) {
	$scope.post = {};
	$http.get('/loadpost', {
    params: { id: $rootScope.postID }
		})
		.success(function(data) {
			$scope.post = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
	});

}]);