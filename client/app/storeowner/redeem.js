var redeem = angular.module('redeem', []);

redeem.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/redeem', {
    templateUrl:'app/storeowner/redeem.tpl.html',
    controller: 'RedeemCtrl',
    resolve: redeem.resolve
  });
}]);

redeem.controller('RedeemCtrl', ['$scope', 'User', function($scope, User) {
	$scope.legitItem = false;
	$scope.qrcode = "";
	$scope.message = "";
	$scope.item = {};
	$scope.cancel = function() {
		$scope.qrcode = "";
		$scope.legitItem = false;
	}
	$scope.submit = function() {
		$scope.message = "";
		User.send('/submitQRCode', {QRCode: $scope.qrcode}, function(err, res) {
			if(res.isLegit) {
				$scope.item = res.item;
				$scope.legitItem = true;
			}
			else
				$scope.message = "Unrecognized QR Code.";
		});	
	}
	$scope.redeem = function() {
		User.send('/redeem', {QRCode: $scope.qrcode}, function(err, res) {
			$scope.qrcode = "";
			$scope.legitItem = false;
		});
	}
	$scope.clear = function() {
		$scope.message = "";
		$scope.qrcode = "";
	}
}]);