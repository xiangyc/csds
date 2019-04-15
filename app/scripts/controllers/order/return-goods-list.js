'use strict';
App.controller('ReturnGoodsCtrl', ['$scope','VdmUtil','$filter','$uibModal','alertService','OrderRecordService','Trans',function ($scope,VdmUtil,$filter,$uibModal,alertService,OrderRecordService,Trans) {
	
	//select中默认显示数
    $scope.viewby = '10';
   //当前页数，默认是第1页
    $scope.currentPage = 1;
    //每页显示记录条数
    $scope.itemsPerPage = $scope.viewby;
    
    $scope.order = {};

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
            returnCode:$scope.returnCode,
            status:$scope.satus,
        	startDate: $filter('date')($scope.startDate, 'yyyy-MM-dd'),
            endDate: $filter('date')($scope.endDate, 'yyyy-MM-dd'),
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        OrderRecordService.queryOrderReturnList(params, function (data) {
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
	
	//键盘回车事件
	$scope.keyDown = function () {
	
    	if (event.keyCode == 13) {
			$scope.getPage();
		}
        
    };
    
    //切换pageSize
    $scope.setItemsPerPage = function (num) {
        $scope.itemsPerPage = num;
        $scope.currentPage = 1; //reset to first paghe
        $scope.getPage();
    };

    $scope.showOrderDetail = function (id) {
        $scope.order =  OrderRecordService.queryOrderDetailById({orderId: id},function() {
            $scope.showDetailForm('max');
        });
    };

    $scope.showDetailForm = function (size) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/order/order-detail.html',
            controller: 'OrderReturnDetailCtrl',
            backdrop: "static",
            resolve: {
                items: function () {
                    return $scope.order;
                }
            },
            size: size
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };

    $scope.showOrderAudit = function (id) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/order/order-return-audit.html',
            controller: 'OrderAuditCtrl',
            backdrop: "static",
            resolve: {
                data: function () {
                    return id;
                }
            },
            size: 'md'
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };

}]);

App.controller('OrderReturnDetailCtrl', ['$scope','$confirm','$uibModalInstance','alertService','items','Trans',function ($scope,$confirm,$uibModalInstance,alertService,items,Trans) {
    
    //设置初始值
    $scope.order = items;
    
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);

App.controller('OrderAuditCtrl', ['$scope','$confirm','$uibModalInstance','alertService','OrderRecordService','data','Trans',
    function ($scope,$confirm,$uibModalInstance,alertService,OrderRecordService,data,Trans) {
        $scope.id = data;
        $scope.auditPass = function () {
                OrderRecordService.orderReturnPass({id: $scope.id}, function () {
                    $uibModalInstance.close();
                    alertService.addSuccessAlert(Trans.trans('commonjs-ycltjts'));
                });
        };

        $scope.auditNotPass = function () {
            if(!$scope.auditNote){
                alertService.addErrorAlert(Trans.trans('commonjs-txyyts'));
                return;
            } else {
                OrderRecordService.orderReturnNotPass({id: $scope.id,note:$scope.auditNote}, function () {
                    $uibModalInstance.close();
                    alertService.addSuccessAlert(Trans.trans('commonjs-bcltjts'));
                });

            }
        };

        $scope.onCancelClick = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }]);

