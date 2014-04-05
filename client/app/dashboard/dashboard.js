var dashboardX = angular.module('dashboard', []);

dashboardX.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/dashboard', {
    templateUrl:'app/dashboard/dashboard.tpl.ejs',
    resolve: dashboardX.resolve
  });
}]);



dashboardX.controller('DashboardCtrl', ['$scope', function($scope) {


}]);