'use strict';
App.controller('SysCouponListCtrl', ['$scope','SysCouponService','$uibModal','$confirm','alertService','Trans',function ($scope,SysCouponService,$uibModal,$confirm,alertService,Trans) {

	//select中默认显示数
    $scope.viewby = '10';
   //当前页数，默认是第1页
    $scope.currentPage = 1;
    //每页显示记录条数
    $scope.itemsPerPage = $scope.viewby;
    //优惠券
    $scope.coupon = {};
	
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
        	name: $scope.name,
            typeId: $scope.typeId,
            startDate: $scope.startDate,
            endDate: $scope.endDate,
            status: $scope.status,
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        SysCouponService.queryCouponList(params, function (data) {
            $scope.totalItems = data.totalItems;
            $scope.data = data.items;
        });
    };

    $scope.query  = function () {
        $scope.currentPage = 1;
        $scope.getPage();
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
    
    $scope.reset = function() {
        $scope.name = null;
        $scope.typeId = null;
        $scope.endDate = null;
        $scope.startDate = null;
        $scope.status = null;
    }; 
    
    //添加角色
    $scope.addCoupon = function () {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/operation/add-sys-coupon.html',
            controller: 'AddSysCouponCtrl',
            backdrop: "static",
            resolve: {
                data: function () {
                    return null;
                }
            },
            size: 'md'
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };

  	//创建窗口
   /* $scope.showCreateForm = function (size) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/operation/add-sys-coupon.html',
            controller: 'AddSysCouponCtrl',
            backdrop: "static",
            size: size
        });
        uibModalInstance.result.then(function () {
        	$scope.getPage();
        });
    };*/
    
    //修改角色
    $scope.editCoupon = function (id) {
    	$scope.coupon =  SysCouponService.queryCouponById({id: id},function() {
            $scope.showEditForm('md');
        });
    };

  	//创建窗口
    $scope.showEditForm = function (size) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/operation/edit-sys-coupon.html',
            controller: 'EditSysCouponCtrl',
            backdrop: "static",
            resolve: {
                items: function () {
                    return $scope.coupon;
                }
            },
            size: size
        });
        uibModalInstance.result.then(function () {
        	$scope.getPage();
        });
    };

    //发放
    $scope.grantCoupon = function (id) {
        $scope.coupon =  SysCouponService.grantCoupon({id: id},function() {
            alertService.addSuccessAlert(Trans.trans('commonjs-ffjts'));
            $scope.getPage();
        });
    };
}]);

//新建角色
App.controller('AddSysCouponCtrl',  ['$scope','$uibModalInstance','alertService','SysCouponService','$filter','Trans',function ($scope,$uibModalInstance,alertService,SysCouponService,$filter,Trans) {

    $scope.save = function () {
    	if(!$scope.coupon){
            alertService.addErrorAlert(Trans.trans('commonjs-jxxts'));
            return;
        }
        if(!$scope.coupon.name){
            alertService.addErrorAlert(Trans.trans('commonjs-jmcts'));
            return;
        }
        if(!$scope.typeId){
            alertService.addErrorAlert(Trans.trans('commonjs-jlxts'));
            return;
        }
        
        var g=/^\d+(\.\d{0,2})?$/;
        
        if($scope.coupon.condition1){
            if(!g.test($scope.coupon.condition1)) {
                alertService.addErrorAlert(Trans.trans('commonjs-qsjeszts'));
                return;
            }
        }
        else {
            alertService.addErrorAlert(Trans.trans('commonjs-qsjets'));
            return;
        }
        if($scope.coupon.value){
            if(!g.test($scope.coupon.value)) {
                alertService.addErrorAlert(Trans.trans('commonjs-jmzszts'));
                return;
            }
        }
        else {
            alertService.addErrorAlert(Trans.trans('commonjs-jmzts'));
            return;
        }
        
        if($scope.typeId == 1){
        	if(parseInt($scope.coupon.value) >= 10 || parseInt($scope.coupon.value) <= 0){
        		alertService.addErrorAlert(Trans.trans('common-zkqmz'));
            	return;
        	}
        }
        
        if(parseInt($scope.coupon.value) > parseInt($scope.coupon.condition1)){
            alertService.addErrorAlert(Trans.trans('commonjs-qsxzjets'));
            return;
        }
        
        if(!$scope.coupon.endTime){
            alertService.addErrorAlert(Trans.trans('commonjs-gqsjts'));
            return;
        }

        if(!$scope.coupon.detail){
            alertService.addErrorAlert(Trans.trans('commonjs-xqts'));
            return;
        }

        //添加
        SysCouponService.addOrUpdate({ name: $scope.coupon.name,typeId:$scope.typeId,condition1:$scope.coupon.condition1, value: $scope.coupon.value,endTime:$filter('date')($scope.coupon.endTime, 'yyyy-MM-dd'),detail:$scope.coupon.detail,status:1 },function() {
        	$uibModalInstance.close();
            alertService.addSuccessAlert(Trans.trans('commonjs-xzyhts'));
        });
        
    };
    
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
}]);

//编辑
App.controller('EditCouponCtrl',  ['$scope','$uibModalInstance','items','alertService','SysCouponService',function ($scope,$uibModalInstance,items,alertService,SysCouponService) {
	//设置初始值
    $scope.coupon = items;
    $scope.save = function () {
    	if(!$scope.coupon){
            alertService.addErrorAlert('券信息不能为空');
            return;
        }
        if(!$scope.coupon.name){
            alertService.addErrorAlert('券名称不能为空');
            return;
        }
        
        //修改
        SysCouponService.addOrUpdate({ id: $scope.coupon.id, name: $scope.coupon.name,condition1:$scope.coupon.condition1, value: $scope.coupon.value  },function() {
        	$uibModalInstance.close();
            alertService.addSuccessAlert('修改券成功');
        });
    };
    
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
}]);

