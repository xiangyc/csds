'use strict';
App.controller('StoreTurnoverListCtrl', ['$scope','VdmUtil','$filter','$uibModal','alertService','FinanceRecordService','Trans',function ($scope,VdmUtil,$filter,$uibModal,alertService,FinanceRecordService,Trans) {
	
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
            startDate: $filter('date')($scope.startDate, 'yyyy-MM-dd'),
            endDate: $filter('date')($scope.endDate, 'yyyy-MM-dd'),
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        FinanceRecordService.queryStoreTurnoverList(params, function (data) {
            $scope.totalItems = data.totalItems;
            $scope.data = data.items;
        });
    };

    $scope.query  = function () {
        $scope.currentPage = 1;
        $scope.getPage();
    };
    
    $scope.reset = function() {
        $scope.startDate = null;
        $scope.endDate = null;
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
    $scope.showStoreTurnOverDetail = function (supermarkStoreId) {
            $scope.showDetailForm('max',supermarkStoreId);
    };

    $scope.showDetailForm = function (size,supermarkStoreId) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/finance/store-turnover-detail.html',
            controller: 'StoreTurnoverDetailCtrl',
            backdrop: "static",
            resolve: {
                supermarkStoreId: function () {
                    return supermarkStoreId;
                }
            },
            size: size
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };

}]);


App.controller('StoreTurnoverDetailCtrl', ['$scope','$confirm','$filter','$uibModalInstance','alertService','supermarkStoreId','FinanceRecordService',function ($scope,$confirm,$filter,$uibModalInstance,alertService,supermarkStoreId,FinanceRecordService) {

    //设置初始值
    $scope.supermarkStoreId = supermarkStoreId;


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
            supermarkStoreId:$scope.supermarkStoreId,
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        FinanceRecordService.findStoreTurnoverDetail(params, function (data) {
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
