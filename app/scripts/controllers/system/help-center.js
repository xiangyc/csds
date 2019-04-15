/**
 * xiangyc
 */
'use strict';
App.controller('HelpCenterCtrl', ['$scope','$uibModal','$confirm','alertService','HelpCenterService','Trans',function($scope,$uibModal,$confirm,alertService,HelpCenterService,Trans) {
    $scope.helpCenter={};
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
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        HelpCenterService.queryHelpList(params, function (data) {
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


	$scope.editHelpCenter = function (id) {
       /* var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/system/edit-help-center.html',
            controller: 'EditHelpCenterCtrl',
            backdrop: "static",
            resolve: {
                data: function () {
                    return null;
                }
            },
            size: 'md'
        });
        uibModalInstance.result.then(function () {
        	alertService.addSuccessAlert('修改成功');
        });*/
        $scope.helpCenter =  HelpCenterService.queryHelpById({id: id},function() {
            $scope.showEditForm('md');
        });

        $scope.showEditForm = function () {
            var uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/system/edit-help-center.html',
                controller: 'EditHelpCenterCtrl',
                backdrop: "static",
                resolve: {
                    data: function () {
                        return $scope.helpCenter;
                    }
                },
                size: 'md'
            });
            uibModalInstance.result.then(function () {
                $scope.getPage();
            });
        };
    };
    
    $scope.addHelpCenter = function () {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/system/add-help-center.html',
            controller: 'AddHelpCenterCtrl',
            backdrop: "static",
            size: 'lg'
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };
    
    $scope.deleteHelpCenter = function (id) {
        $confirm({title: Trans.trans('commonjs-warning'), text: Trans.trans('commonjs-qdscgjlts'), ok: Trans.trans('commonjs-ok'), cancel: Trans.trans('common-cancel')},{size: 'sm'}).then(function (){
            HelpCenterService.deleteHelp({id: id}, function () {
                alertService.addSuccessAlert(Trans.trans('commonjs-sccgts'));
                $scope.getPage();
            });
        });
    };

}]);

/*
App.controller('AddHelpCenterCtrl', ['$scope','$uibModalInstance',function($scope,$uibModalInstance) {

    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.save = function () {
    	$uibModalInstance.close();
    };

}]);

App.controller('EditHelpCenterCtrl',['$scope','$uibModalInstance',function($scope,$uibModalInstance) {

    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.save = function () {
    	$uibModalInstance.close();
    };

}]);*/

App.controller('AddHelpCenterCtrl', ['$scope','$uibModalInstance','HelpCenterService','alertService','Trans',function($scope,$uibModalInstance,HelpCenterService,alertService,Trans) {

    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.save = function () {
        //验证
        if(!$scope.helpCenter){
            alertService.addErrorAlert(Trans.trans('commonjs-bzxxts'));
            return;
        }
        if(!$scope.helpCenter.name){
            alertService.addErrorAlert(Trans.trans('commonjs-cjwtts'));
            return;
        }
        if(!$scope.helpCenter.content){
            alertService.addErrorAlert(Trans.trans('commonjs-wtjdts'));
            return;
        }


        HelpCenterService.addOrUpdate({ name: $scope.helpCenter.name, content: $scope.helpCenter.content},function() {
            $uibModalInstance.close();
            alertService.addSuccessAlert(Trans.trans('commonjs-xzyhts'));
        });

    };

}]);

App.controller('EditHelpCenterCtrl',['$scope','$uibModalInstance','HelpCenterService','data','alertService',function($scope,$uibModalInstance,HelpCenterService,data,alertService) {

    //设置初始值
    $scope.helpCenter = data;
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.save = function () {
        //验证
        if(!$scope.helpCenter){
            alertService.addErrorAlert(Trans.trans('commonjs-bzxxts'));
            return;
        }
        if(!$scope.helpCenter.name){
            alertService.addErrorAlert(Trans.trans('commonjs-cjwtts'));
            return;
        }
        if(!$scope.helpCenter.content){
            alertService.addErrorAlert(Trans.trans('commonjs-wtjdts'));
            return;
        }
        HelpCenterService.addOrUpdate({id: $scope.helpCenter.id,  name: $scope.helpCenter.name, content: $scope.helpCenter.content},function() {
            $uibModalInstance.close();
            alertService.addSuccessAlert(Trans.trans('commonjs-xgcgts'));
        });

    };

}]);

