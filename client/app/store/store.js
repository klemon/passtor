var store = angular.module('store', []);

store.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/store', {
    templateUrl:'app/store/store.tpl.ejs',
    resolve: store.resolve
  });
}]);



store.controller('StoreCtrl', ['$scope', function($scope) {


}]);