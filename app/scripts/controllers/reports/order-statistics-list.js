'use strict';
App.controller('OrderStatisticsListCtrl', ['$scope','VdmUtil','$filter','$uibModal','alertService','OrderSaleService',function ($scope,VdmUtil,$filter,$uibModal,alertService,OrderSaleService) {
	
	$scope.init = function () {
        OrderSaleService.findOrderStatistics(function (data) {
            $scope.platform = data;
        });
    };
    
}]);
