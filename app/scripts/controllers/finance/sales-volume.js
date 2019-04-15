'use strict';
App.controller('SalesVolumeListCtrl', ['$scope','VdmUtil','$filter','$uibModal','alertService','FinanceRecordService','Trans',function ($scope,VdmUtil,$filter,$uibModal,alertService,FinanceRecordService,Trans) {
	
	//select中默认显示数
    $scope.viewby = '10';
   //当前页数，默认是第1页
    $scope.currentPage = 1;
    //每页显示记录条数
    $scope.itemsPerPage = $scope.viewby;
    
    $scope.tradeLog = {};
    
	$scope.first = "首页";
    $scope.last = "末页";
    $scope.previous = "上一页";
    $scope.next = "下一页";
    $scope.records = " 条记录 ";
    $scope.total = "总共";
	$scope.lang = window.localStorage.lang;
	if(!$scope.lang){
		$scope.lang = "en";
	}
	if($scope.lang == 'en'){
		$scope.first = "first";
	    $scope.last = "last";
	    $scope.previous = "previous";
	    $scope.next = "next";
	    $scope.records = " records ";
	    $scope.total = "a total of ";
	}
    //分页
    $scope.getPage = function() {
    
    	//校验日期
        if ($scope.startDate > $scope.endDate) {
             alertService.addErrorAlert(Trans.trans('commonjs-sjts'));
             return;
        }
        
        //查询参数
        var params = {
            mobile:$scope.mobile,
            tradeType:$scope.tradeType,
            timeType:$scope.timeType,
        	startDate: $filter('date')($scope.startDate, 'yyyy-MM-dd'),
            endDate: $filter('date')($scope.endDate, 'yyyy-MM-dd'),
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        FinanceRecordService.querySalesVolumeList(params, function (data) {
            $scope.totalItems = data.totalItems;
            $scope.data = data.items;
        });
    };

    $scope.query  = function () {
        $scope.currentPage = 1;
        $scope.getPage();
    };
    
    $scope.reset = function() {
        $scope.mobile = null;
        $scope.startDate = null;
        $scope.endDate = null;
        $scope.timeType = null;
    };
    
    // 下一页
    $scope.pageChanged = function () {
        $scope.getPage();
    };

    //切换pageSize
    $scope.setItemsPerPage = function (num) {
        $scope.itemsPerPage = num;
        $scope.currentPage = 1; //reset to first paghe
        $scope.getPage();
    };


	//详情
    $scope.showSalesVolumeDetail = function (supermarkId) {
            $scope.showDetailForm('max',supermarkId);
    };

    $scope.showDetailForm = function (size,supermarkId) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/finance/sales-volume-detail.html',
            controller: 'SalesVolumeDetailCtrl',
            backdrop: "static",
            resolve: {
                supermarkId: function () {
                    return supermarkId;
                }
            },
            size: size
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };

}]);

App.controller('SalesVolumeDetailCtrl', ['$scope','$confirm','$filter','$uibModalInstance','alertService','supermarkId','FinanceRecordService',function ($scope,$confirm,$filter,$uibModalInstance,alertService,supermarkId,FinanceRecordService) {

    //设置初始值
    $scope.supermarkId = supermarkId;


    //select中默认显示数
    $scope.viewby = '10';
    //当前页数，默认是第1页
    $scope.currentPage = 1;
    //每页显示记录条数
    $scope.itemsPerPage = $scope.viewby;
    
    $scope.first = "首页";
    $scope.last = "末页";
    $scope.previous = "上一页";
    $scope.next = "下一页";
    $scope.records = " 条记录 ";
    $scope.total = "总共";
	$scope.lang = window.localStorage.lang;
	if(!$scope.lang){
		$scope.lang = "en";
	}
	if($scope.lang == 'en'){
		$scope.first = "first";
	    $scope.last = "last";
	    $scope.previous = "previous";
	    $scope.next = "next";
	    $scope.records = " records ";
	    $scope.total = "a total of ";
	}

    //分页
    $scope.getPage = function() {

        //查询参数
        var params = {
            supermarkId:$scope.supermarkId,
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        FinanceRecordService.findSalesVolumeDetail(params, function (data) {
            $scope.totalItems = data.totalItems;
            $scope.data = data.items;
        });
    };

    // 下一页
    $scope.pageChanged = function () {
        $scope.getPage();
    };

    //切换pageSize
    $scope.setItemsPerPage = function (num) {
        $scope.itemsPerPage = num;
        $scope.currentPage = 1; //reset to first paghe
        $scope.getPage();
    };

    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };


}]);
