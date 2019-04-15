/**
 * xiangyc
 */
'use strict';
App.controller('AppVersionCtrl', ['$scope','$uibModal','$confirm','alertService','$filter','AppVersionService','Trans',function($scope,$uibModal,$confirm,alertService,$filter,AppVersionService,Trans) {
    $scope.version={};
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
            startDate: $filter('date')($scope.startDate, 'yyyy-MM-dd'),
            endDate: $filter('date')($scope.endDate, 'yyyy-MM-dd'),
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        AppVersionService.queryAppVersionList(params, function (data) {
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

    $scope.editAppVersion = function (id) {
        $scope.version =  AppVersionService.queryAppVersionById({id: id},function() {
            $scope.showEditForm('md');
        });
    };

	$scope.showEditForm = function () {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/system/edit-app-version.html',
            controller: 'EditAppVersionCtrl',
            backdrop: "static",
            resolve: {
                data: function () {
                    return $scope.version;
                }
            },
            size: 'md'
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };
    
    $scope.addAppVersion = function () {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/system/add-app-version.html',
            controller: 'AddAppVersionCtrl',
            backdrop: "static",
            size: 'md'
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };
    
    $scope.deleteAppVersion = function (id) {
        $confirm({title: Trans.trans('commonjs-warning'), text: Trans.trans('commonjs-qdscgjlts'), ok: Trans.trans('commonjs-ok'), cancel: Trans.trans('common-cancel')},{size: 'sm'}).then(function (){
            AppVersionService.deleteAppVersion({id: id}, function () {
                alertService.addSuccessAlert(Trans.trans('commonjs-sccgts'));
                $scope.getPage();
            });
        });
    };

}]);

App.controller('AddAppVersionCtrl', ['$scope','$uibModalInstance','AppVersionService','alertService','Trans',function($scope,$uibModalInstance,AppVersionService,alertService,Trans) {
    
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
    $scope.save = function () {
        //验证
        if(!$scope.version){
            alertService.addErrorAlert(Trans.trans('commonjs-bbxxts'));
            return;
        }
        if(!$scope.version.version){
            alertService.addErrorAlert(Trans.trans('commonjs-bbhts'));
            return;
        }
        if(!$scope.version.publishPlatform){
            alertService.addErrorAlert(Trans.trans('commonjs-fbptts'));
            return;
        }
        if(!$scope.version.downloadUrl){
            alertService.addErrorAlert(Trans.trans('commonjs-xzurlts'));
            return;
        }
        if(!$scope.version.description){
            alertService.addErrorAlert(Trans.trans('commonjs-msts'));
            return;
        }

        if(!$scope.version.packageName){
            alertService.addErrorAlert(Trans.trans('commonjs-bmts'));
            return;
        }

        AppVersionService.addOrUpdate({ version: $scope.version.version, publishPlatform: $scope.version.publishPlatform,downloadUrl:$scope.version.downloadUrl,description:$scope.version.description,packageName:$scope.version.packageName  },function() {
            $uibModalInstance.close();
            alertService.addSuccessAlert(Trans.trans('commonjs-xzyhts'));
        });

    };

}]);

App.controller('EditAppVersionCtrl',['$scope','$uibModalInstance','AppVersionService','data','alertService','Trans',function($scope,$uibModalInstance,AppVersionService,data,alertService,Trans) {

    //设置初始值
    $scope.version = data;
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
    $scope.save = function () {
        //验证
        if(!$scope.version){
            alertService.addErrorAlert(Trans.trans('commonjs-bbxxts'));
            return;
        }
        if(!$scope.version.version){
            alertService.addErrorAlert(Trans.trans('commonjs-bbhts'));
            return;
        }
        if(!$scope.version.publishPlatform){
            alertService.addErrorAlert(Trans.trans('commonjs-fbptts'));
            return;
        }
        if(!$scope.version.downloadUrl){
            alertService.addErrorAlert(Trans.trans('commonjs-xzurlts'));
            return;
        }
        if(!$scope.version.description){
            alertService.addErrorAlert(Trans.trans('commonjs-msts'));
            return;
        }

        if(!$scope.version.packageName){
            alertService.addErrorAlert(Trans.trans('commonjs-bmts'));
            return;
        }
        AppVersionService.addOrUpdate({id: $scope.version.id, version: $scope.version.version, publishPlatform: $scope.version.publishPlatform,downloadUrl:$scope.version.downloadUrl,description:$scope.version.description,packageName:$scope.version.packageName   },function() {
            $uibModalInstance.close();
            alertService.addSuccessAlert(Trans.trans('commonjs-xgcgts'));
        });

    };

}]);
