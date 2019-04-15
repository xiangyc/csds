'use strict';
App.controller('OrderRecordCtrl', ['$scope','VdmUtil','$filter','$uibModal','alertService','OrderRecordService','Trans',function ($scope,VdmUtil,$filter,$uibModal,alertService,OrderRecordService,Trans) {
	
	//select中默认显示数
    $scope.viewby = '10';
   //当前页数，默认是第1页
    $scope.currentPage = 1;
    //每页显示记录条数
    $scope.itemsPerPage = $scope.viewby;
    
    $scope.order = {};
    
    $("#activityId").attr("disabled","disabled");
	
	
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
            status:$scope.status,
            no:$scope.no,
            type:$scope.type,
            hasActivity:$scope.hasActivity,
            activityId:$scope.activityId,
            returnCode:$scope.returnCode,
        	startDate: $filter('date')($scope.startDate, 'yyyy-MM-dd'),
            endDate: $filter('date')($scope.endDate, 'yyyy-MM-dd'),
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        OrderRecordService.queryOrderList(params, function (data) {
            $scope.totalItems = data.totalItems;
            $scope.data = data.items;
        });
    };

    $scope.query  = function () {
        $scope.currentPage = 1;
        $scope.getPage();
    };
    
    //重置查询条件
    $scope.reset = function() {
        //$scope.mobile = null;
        $scope.status = null;
        $scope.startDate = null;
        $scope.endDate = null;
    };
    
    // 下一页
    $scope.pageChanged = function () {
        $scope.getPage();
    };
    
    //键盘回车事件
    $scope.keyDown = function (e) {
        var keycode = window.event?e.keyCode:e.which;
        if(keycode== 13) {
			$scope.getPage();
		}
    };

    //切换pageSize
    $scope.setItemsPerPage = function (num) {
        $scope.itemsPerPage = num;
        $scope.currentPage = 1; //reset to first paghe
        $scope.getPage();
    };
    
    $scope.changeTarget = function () {
        if($scope.hasActivity === '0' || $scope.hasActivity === ''){
        	$scope.activityId = null;
            $("#activityId").attr("disabled","disabled");
         } else {
            $("#activityId").removeAttr("disabled");
        }
    };
    
    $scope.showOrderDetail = function (id,status) {
    	$scope.order =  OrderRecordService.queryOrderDetailById({orderId: id},function() {
          $scope.showDetailForm('max',status);
      });
    };
    
    $scope.showDetailForm = function (size,status) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/order/order-detail.html',
            controller: 'OrderDetailCtrl',
            backdrop: "static",
            resolve: {
                items: function () {
                    return $scope.order;
                },
                status:function () {
                    return status;
                },
            },
            size: size
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };

    //时效设置
    $scope.showPrescription = function () {
       $scope.prescription =  OrderRecordService.getOrderPrescription(function() {
            $scope.showPrescriptionForm('md');
        });


    };
    //时效设置窗口
    $scope.showPrescriptionForm = function (size) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/order/edit-order-prescription.html',
            controller: 'OrderPrescriptionCtrl',
            backdrop: "static",
            resolve: {
                prescription: function () {
                    return $scope.prescription;
                }
            },
            size: size
        });
        
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };

   //申请退货,申请换货
    $scope.showOrderReturn = function (id,orderType,returnStatus,exchangeStatus) {
    
    	if(orderType == 2){
    		if(exchangeStatus == 0){
    			alertService.addErrorAlert(Trans.trans('commonjs-ddhhsqts'));
             	return;
    		}
    	}
    	
    	if(orderType == 3){
    		if(returnStatus == 0){
    			alertService.addErrorAlert(Trans.trans('commonjs-ddthsqts'));
             	return;
    		}
    	}
    	
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/order/order-return-apply.html',
            controller: 'AuditOrderReturnCtrl',
            backdrop: "static",
            resolve: {
                data: function () {
                    return id;
                },
                orderType:
                    function () {
                        return orderType;
                    }
            },
            size: 'md'
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };

}]);

App.controller('OrderDetailCtrl', ['$scope','$confirm','$uibModalInstance','alertService','items','status', 'OrderRecordService','Trans',function ($scope,$confirm,$uibModalInstance,alertService,items,status,OrderRecordService,Trans) {
    
    //设置初始值
    $scope.order = items;
    $scope.status = status;

    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };

    //验货
    $scope.orderCheck=function (id) {
        $scope.order =  OrderRecordService.orderCheck({orderId: id},function() {
            $uibModalInstance.close();
            alertService.addSuccessAlert(Trans.trans('commonjs-yhwcts'));
        });
    };

}]);

App.controller('AuditOrderReturnCtrl', ['$scope','$confirm','$uibModalInstance','alertService','OrderRecordService','data','orderType','Trans',
    function ($scope,$confirm,$uibModalInstance,alertService,OrderRecordService,data,orderType,Trans) {
        $scope.id = data;
        $scope.orderType = orderType;
        $scope.auditPass = function () {
            if(!$scope.auditNote){
                alertService.addErrorAlert(Trans.trans('commonjs-txyyts'));
                return;
            } else {
                OrderRecordService.addReturnOrder({id: $scope.id,note:$scope.auditNote,orderType:$scope.orderType}, function () {
                    $uibModalInstance.close();
                    alertService.addSuccessAlert(Trans.trans('commonjs-ycltjts'));
                });
            }
        };

        $scope.auditNotPass = function () {
            if(!$scope.auditNote){
                alertService.addErrorAlert(Trans.trans('commonjs-txyyts'));
                return;
            } else {
                OrderRecordService.addReturnOrder({id: $scope.id,note:$scope.auditNote}, function () {
                    $uibModalInstance.close();
                    alertService.addSuccessAlert(Trans.trans('commonjs-bcltjts'));
                });

            }
        };

        $scope.onCancelClick = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }]);

App.controller('OrderPrescriptionCtrl',['$scope','$uibModalInstance','OrderRecordService','prescription','alertService','Trans',function($scope,$uibModalInstance,OrderRecordService,prescription,alertService,Trans) {

    //设置初始值
    $scope.prescription = prescription;
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.save = function () {
        //验证
        if(!$scope.prescription.value){
            alertService.addErrorAlert(Trans.trans('commonjs-cssjts'));
            return;
        }

        OrderRecordService.updatePrescription({value: $scope.prescription.value},function() {
            $uibModalInstance.close();
            alertService.addSuccessAlert(Trans.trans('commonjs-xgcgts'));
        });

    };

}]);
