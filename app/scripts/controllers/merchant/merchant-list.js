'use strict';
App.controller('MerchantListCtrl', ['$scope','$filter','alertService','$uibModal','$location','Login','MerchantService','Trans',function ($scope,$filter,alertService,$uibModal,$location,Login,MerchantService,Trans) {
	
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
    
    	//校验日期
        if ($scope.startDate > $scope.endDate) {
             alertService.addErrorAlert(Trans.trans('commonjs-sjts'));
             return;
        }
        
        //查询参数
        var params = {
        	mobile:$scope.mobile,
        	status:1,
        	startDate: $filter('date')($scope.startDate, 'yyyy-MM-dd'),
            endDate: $filter('date')($scope.endDate, 'yyyy-MM-dd'),
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        MerchantService.queryMerchantList(params, function (data) {
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
    
    
    //审核详情
    $scope.showMerchantLog = function (merchantId) {
        $scope.showMerchantLogForm('max',merchantId);
    };

    $scope.showMerchantLogForm = function (size,merchantId) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/merchant/apply-merchant-log.html',
            controller: 'MerchantLogCtrl',
            backdrop: "static",
            resolve: {
                merchantId: function () {
                    return merchantId;
                }
            },
            size: size
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };
    

}]);


App.controller('MerchantLogCtrl', ['$scope','$confirm','$filter','$uibModalInstance','alertService','merchantId','MerchantService',function ($scope,$confirm,$filter,$uibModalInstance,alertService,merchantId,MerchantService) {

    //设置初始值
    $scope.merchantId = merchantId;
    //select中默认显示数
    $scope.viewby = '10';
    //当前页数，默认是第1页
    $scope.currentPage = 1;
    //每页显示记录条数
    $scope.itemsPerPage = $scope.viewby;

    //分页
    $scope.getPage = function() {
		
		$scope.showMerchantDetail();
		
        //查询参数
        var params = {
            merchantId:$scope.merchantId,
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        MerchantService.applyMerchantLog(params, function (data) {
            $scope.totalItems = data.totalItems;
            $scope.data = data.items;
        });
    };
    
    $scope.showMerchantDetail = function() {
		
        MerchantService.queryMerchantDetail({id: merchantId}, function (data) {
            $scope.merchantDetail = data;
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