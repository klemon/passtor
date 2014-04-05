var signup = angular.module('signup', []);

signup.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/signup', {
    templateUrl:'app/security/signup.tpl.ejs',
    resolve: signup.resolve
  });
}]);



signup.controller('SignupCtrl', ['$scope', function($scope) {


}]);