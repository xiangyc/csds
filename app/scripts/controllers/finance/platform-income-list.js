'use strict';
App.controller('PlatformIncomeCtrl', ['$scope','VdmUtil','$filter','$uibModal','alertService','PlatformIncomeService',function ($scope,VdmUtil,$filter,$uibModal,alertService,PlatformIncomeService) {
	
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
             alertService.addErrorAlert('结束时间必须大于起始时间');
             return;
        }
        
        //查询参数
        var params = {
        	startDate: $filter('date')($scope.startDate, 'yyyy-MM-dd'),
            endDate: $filter('date')($scope.endDate, 'yyyy-MM-dd'),
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        PlatformIncomeService.queryIncomeList(params, function (data) {
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

    //时效设置
    $scope.showSettlementCycle = function () {
        $scope.cycle =  PlatformIncomeService.getSettlementCycle(function() {
            $scope.showSettlementCycleForm('md');
        });
    };
    //时效设置窗口
    $scope.showSettlementCycleForm = function (size) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/finance/edit-income-cycle.html',
            controller: 'IncomeSettlementCycleCtrl',
            backdrop: "static",
            resolve: {
                cycle: function () {
                    return $scope.cycle;
                }
            },
            size: size
        });
        
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
        
    };

    //详情
    $scope.showIncomeDetail = function (supermarkId,createTime) {
            $scope.showIncomeDetailForm('max',supermarkId,createTime);
    };

    $scope.showIncomeDetailForm = function (size,supermarkId,createTime) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/finance/platform-income-detail.html',
            controller: 'IncomeDetailCtrl',
            backdrop: "static",
            resolve: {
                supermarkId: function () {
                    return supermarkId;
                },
                createTime:function () {
                    return createTime;
                },
            },
            size: size
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };
}]);

App.controller('IncomeSettlementCycleCtrl',['$scope','$uibModalInstance','PlatformIncomeService','cycle','alertService',function($scope,$uibModalInstance,PlatformIncomeService,cycle,alertService) {

    //设置初始值
    $scope.cycle = cycle;
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.save = function () {
        //验证
        if(!$scope.cycle.value){
            alertService.addErrorAlert('结算周期不能为空');
            return;
        }

        PlatformIncomeService.updateSettlementCycle({value: $scope.cycle.value},function() {
            $uibModalInstance.close();
            alertService.addSuccessAlert('修改结算周期成功');
        });

    };

}]);

App.controller('IncomeDetailCtrl', ['$scope','$confirm','$filter','$uibModalInstance','alertService','supermarkId','createTime', 'PlatformIncomeService',function ($scope,$confirm,$filter,$uibModalInstance,alertService,supermarkId,createTime,PlatformIncomeService) {

    //设置初始值
    $scope.supermarkId = supermarkId;
    $scope.createTime = createTime;


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
            startDate: $filter('date')($scope.createTime, 'yyyy-MM-dd'),
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        PlatformIncomeService.queryIncomeDetail(params, function (data) {
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
