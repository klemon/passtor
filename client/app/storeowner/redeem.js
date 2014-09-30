var redeem = angular.module('redeem', []);

redeem.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/redeem', {
    templateUrl:'app/storeowner/redeem.tpl.html',
    controller: 'RedeemCtrl',
    resolve: redeem.resolve
  });
}]);

redeem.controller('RedeemCtrl', ['$scope', 'User', function($scope, User) {
	console.log("redeem mode");
    $scope.url = "";
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
    $scope.scan = function() {
        document.addEventListener("intel.xdk.device.barcode.scan", barcodeScanned, false);
        function barcodeScanned(evt) {
            intel.xdk.notification.beep(1);
            if (evt.type == "intel.xdk.device.barcode.scan") {
                if (evt.success == true) {
                    //var url = evt.codedata;
                    $scope.url = evt.codedata;
                    console.log("data: " + evt.codedata);
                    //intel.xdk.device.showRemoteSite(url, 264, 0,56, 48)
                } else {
                  //scan cancelled
                  //$scope.url = "Scan cancelled";
                  //console.log("Scan cancelled");
                }
            }
            $scope.$apply();
        }
        intel.xdk.device.scanBarcode();
    }
}]);