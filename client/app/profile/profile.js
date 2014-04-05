var profile = angular.module('profile', []);

profile.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/profile', {
    templateUrl:'app/profile/profile.tpl.ejs',
    resolve: profile.resolve
  });
}]);



profile.controller('ProfileCtrl', ['$scope', function($scope) {


}]);