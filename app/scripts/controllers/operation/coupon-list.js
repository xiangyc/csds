'use strict';
App.controller('CouponCtrl', ['$scope','CouponService','$uibModal',function ($scope,CouponService,$uibModal) {

	//select中默认显示数
    $scope.viewby = '10';
   //当前页数，默认是第1页
    $scope.currentPage = 1;
    //每页显示记录条数
    $scope.itemsPerPage = $scope.viewby;
    //角色
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
            mobile: $scope.mobile,
            status: $scope.status,
            startDate: $scope.startDate,
            endDate: $scope.endDate,
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        CouponService.queryCouponRecordsList(params, function (data) {
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
        $scope.mobile = null;
        $scope.status = null;
        $scope.startDate = null;
        $scope.endDate = null;
    }; 
    
    //添加角色
    $scope.addCoupon = function () {
        $scope.showCreateForm('md');
    };

  	//创建窗口
    $scope.showCreateForm = function (size) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/operation/add-coupon.html',
            controller: 'AddCouponCtrl',
            backdrop: "static",
            size: size
        });
        uibModalInstance.result.then(function () {
        	$scope.getPage();
        });
    };
    
    //修改角色
    $scope.editCoupon = function (id) {
    	$scope.coupon =  CouponService.queryCouponById({id: id},function() {
            $scope.showEditForm('md');
        });
    };

  	//创建窗口
    $scope.showEditForm = function (size) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/operation/edit-coupon.html',
            controller: 'EditCouponCtrl',
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
    

}]);

//新建角色
App.controller('AddCouponCtrl',  ['$scope','$uibModalInstance','alertService','CouponService',function ($scope,$uibModalInstance,alertService,CouponService) {

    $scope.save = function () {
    	if(!$scope.coupon){
            alertService.addErrorAlert('券信息不能为空');
            return;
        }
        if(!$scope.coupon.name){
            alertService.addErrorAlert('券名称不能为空');
            return;
        }
        
        //添加
        CouponService.addOrUpdate({ name: $scope.coupon.name, value: $scope.coupon.value  },function() {
        	$uibModalInstance.close();
            alertService.addSuccessAlert('添加券成功');
        });
        
    };
    
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
}]);

//编辑角色
App.controller('EditCouponCtrl',  ['$scope','$uibModalInstance','items','alertService',function ($scope,$uibModalInstance,items,alertService) {
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
//      RoleService.addOrUpdateRole({ id: $scope.coupon.id, name: $scope.coupon.name, value: $scope.coupon.value  },function() {
//      	$uibModalInstance.close();
//          alertService.addSuccessAlert('修改券成功');
//      });
    };
    
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
}]);

