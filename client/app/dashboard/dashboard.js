var dashboard = angular.module('dashboard', []);

dashboard.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/dashboard', {
    templateUrl:'app/dashboard/dashboard.tpl.ejs',
    resolve: dashboard.resolve
  });
}]);



dashboard.controller('DashboardCtrl', ['$scope', function($scope) {


}]);