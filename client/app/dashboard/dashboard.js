angular.module('dashboard', [])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/dashboard', {
    templateUrl:'app/dashboard/dashboard.tpl.html',
    controller:'DashboardCtrl'
  });
}])

.controller('DashboardCtrl', ['$scope' function ($scope) {
  $scope.post = {};

  $scope.submit = function() {
    //var request = $http.post('/post', {email: $scope.post.title, password: $scope.post.description});
  };
}]);
