var store = angular.module('store', []);

store.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/store', {
    templateUrl:'app/store/store.tpl.html',
    resolve: store.resolve
  });
}]);



store.controller('StoreCtrl', ['$scope', function($scope) {


}]);