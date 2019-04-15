'use strict';
App.controller('StaffListCtrl', ['$scope','$uibModal','alertService','$confirm','StaffService','Trans',function ($scope,$uibModal,alertService,$confirm,StaffService,Trans) {
	//select中默认显示数
    $scope.viewby = '10';
   //当前页数，默认是第1页
    $scope.currentPage = 1;
    //每页显示记录条数
    $scope.itemsPerPage = $scope.viewby;
    //翻页时，页面上显示的最大页数，
    $scope.maxSize = 10;

    $scope.user = {};
	
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
            loginName: $scope.loginName,
            name: $scope.name,
            mobile: $scope.mobile,
            start: ($scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        StaffService.queryStaffList(params,function (data) {
            $scope.totalItems = data.totalItems;
            $scope.data = data.items;
        });
    };
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };
    $scope.pageChanged = function () {
        $scope.getPage();
    };
    //切换pageSize
    $scope.setItemsPerPage = function (num) {
        $scope.itemsPerPage = num;
        $scope.currentPage = 1; //reset to first paghe
        $scope.getPage();
    };

    $scope.query  = function () {
        $scope.currentPage = 1; //reset to first paghe
        $scope.getPage();
    };
    $scope.reset = function() {
        $scope.name = null;
        $scope.loginName = null;
        $scope.mobile = null;
    };
    
    //添加员工
    $scope.addStaff = function () {
        $scope.showCreateForm('md');
    };
    //添加员工弹出窗口
    $scope.showCreateForm = function (size) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/user/add-staff.html',
            controller: 'AddStaffCtrl',
            backdrop: "static",
            size: size
        });
        uibModalInstance.result.then(function () {
        	$scope.reset();
            $scope.query();
        });
    };
    
    //修改员工弹出窗口
    $scope.showEditForm = function (size) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/user/edit-staff.html',
            controller: 'EditStaffCtrl',
            backdrop: "static",
            resolve: {
                items: function () {
                    return $scope.user;
                }
            },
            size:size
        });
        uibModalInstance.result.then(function () {
        	$scope.reset();
            $scope.query();
        });
    };
    
    //删除员工绑定事件
    $scope.deleteStaff = function (id) {
        $confirm({title: Trans.trans('commonjs-warning'), text: Trans.trans('commonjs-qdscgjlts'),ok:Trans.trans('commonjs-ok'),cancel: Trans.trans('common-cancel')},{size: 'sm'}).then(function () {
            StaffService.delete({id: id}, function () {
                $scope.reset();
                $scope.query();
                alertService.addSuccessAlert(Trans.trans('commonjs-sccgts'));
            });
        });
    };
    
    //修改员工
    $scope.editStaff = function (id) {
        $scope.user =  StaffService.queryStaffById({id:id},function() {
            $scope.showEditForm('md');
        });

    };
    
    //禁用员工
    $scope.disabledStaff = function (id) {
        $confirm({title: Trans.trans('commonjs-warning'), text: Trans.trans('commonjs-qrjyyhts'),ok:Trans.trans('commonjs-ok'),cancel: Trans.trans('common-cancel')},{size: 'sm'}).then(function () {
            StaffService.forbidStaff({id: id}, function () {
                $scope.reset();
                $scope.query();
                alertService.addSuccessAlert(Trans.trans('commonjs-jyyhcgts'));
            });
        });
    };
    //启用员工
    $scope.startStaff = function (id) {
        $confirm({title: Trans.trans('commonjs-warning'), text: Trans.trans('commonjs-qrqyyhts'),ok:Trans.trans('commonjs-ok'),cancel: Trans.trans('common-cancel')},{size: 'sm'}).then(function () {
            StaffService.startStaff({id: id}, function () {
                $scope.reset();
                $scope.query();
                alertService.addSuccessAlert(Trans.trans('commonjs-qyhyts'));
            });
        });
    };
    $scope.resetPwd = function (id) {
        $confirm({title: Trans.trans('commonjs-warning'), text: Trans.trans('commonjs-qrmmczts'),ok:Trans.trans('commonjs-ok'),cancel: Trans.trans('common-cancel')},{size: 'sm'}).then(function () {
            $scope.user =  StaffService.resetPwd({id:id},function() {
                $scope.reset();
                $scope.query();
                alertService.addSuccessAlert(Trans.trans('commonjs-mmczts'));
            });
        });
    };

}]);
//添加用户控制器
App.controller('AddStaffCtrl',  ['$scope','$uibModalInstance','StaffService','alertService','Trans',function ($scope,$uibModalInstance,StaffService,alertService,Trans) {
	
	var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}|(17[0-9]{1})))+\d{8})$/;
    $scope.save = function () {
        if(!$scope.user){
            alertService.addErrorAlert(Trans.trans('commonjs-yhxxts'));
            return;
        }
        if(!$scope.user.loginName){
            alertService.addErrorAlert(Trans.trans('commonjs-ygzhts'));
            return;
        }
        if(!$scope.user.name){
            alertService.addErrorAlert(Trans.trans('commonjs-xmts'));
            return;
        }
        if(!$scope.user.mobile){
            alertService.addErrorAlert(Trans.trans('commonjs-sjhts'));
            return;
        }
        if(!myreg.test($scope.user.mobile)) {
            alertService.addErrorAlert(Trans.trans('commonjs-yxsjhts'));
            return;
        }
        if(!$scope.user.position){
            alertService.addErrorAlert(Trans.trans('commonjs-zwts'));
            return;
        }
        StaffService.save($scope.user, function () {
            $uibModalInstance.close();
            alertService.addSuccessAlert(Trans.trans('commonjs-xzyhts'));
        });
    };
    
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
//修改用户控制器
App.controller('EditStaffCtrl',  ['$scope','$uibModalInstance','items','alertService','Trans',function ($scope,$uibModalInstance,items,alertService,Trans) {
	
	var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}|(17[0-9]{1})))+\d{8})$/;
    //设置初始值
    $scope.user = items;
   //修改员工
    $scope.save = function () {
        if(!$scope.user.name){
            alertService.addErrorAlert(Trans.trans('commonjs-xmts'));
            return;
        }
        if(!$scope.user.mobile){
            alertService.addErrorAlert(Trans.trans('commonjs-sjhts'));
            return;
        }
        if(!myreg.test($scope.user.mobile)) {
            alertService.addErrorAlert(Trans.trans('commonjs-yxsjhts'));
            return;
        }
        if(!$scope.user.position){
            alertService.addErrorAlert(Trans.trans('commonjs-zwts'));
            return;
        }
        $scope.user.$update(function () {
            //关闭窗口
            $uibModalInstance.close();
            alertService.addSuccessAlert(Trans.trans('commonjs-xgcgts'));
        });
    };
    
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);