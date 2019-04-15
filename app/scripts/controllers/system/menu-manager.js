/**
 * xiangyc
 */
'use strict';
App.controller('MenuManagerCtrl', ['$scope','$uibModal','$confirm','alertService','MenuManagerService','Trans',function($scope,$uibModal,$confirm,alertService,MenuManagerService,Trans) {
    $scope.menuManager={};

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

/*
    $scope.getInit = function () {
        $scope.menuTypeId = data[0].id;//如果想要第一个值
                // 上级菜单列表
         StoreService.getStoreList({supermarketId: $scope.supermarketId},function(data) {
                    $scope.supermarketstore = data;
                    if(data.length >= 1){
                        $scope.supermarketStoreId = data[0].id;//如果想要第一个值
                        $scope.getPage();
                    }

                });
    };*/

    //分页
    $scope.getPage = function() {
        //查询参数
        var params = {
            type:$scope.type,
            menuName:$scope.menuName,
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        MenuManagerService.queryMenuList(params, function (data) {
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


	$scope.editMenuManager = function (id) {
        /*var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/system/edit-menu-manager.html',
            controller: 'EditMenuManagerCtrl',
            backdrop: "static",
            resolve: {
                data: function () {
                    return null;
                }
            },
            size: 'md'
        });*/

        $scope.menuManager =  MenuManagerService.queryMenuById({id: id},function() {
            $scope.showEditForm('md');
        });

        $scope.showEditForm = function () {
            var uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/system/edit-menu-manager.html',
                controller: 'EditMenuManagerCtrl',
                backdrop: "static",
                resolve: {
                    data: function () {
                        return $scope.menuManager;
                    }
                },
                size: 'md'
            });
            uibModalInstance.result.then(function () {
                $scope.getPage();
            });
        };

    };
    
    $scope.addMenuManager = function () {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/system/add-menu-manager.html',
            controller: 'AddMenuManagerCtrl',
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


    $scope.deleteMenuManager = function (id) {
        $confirm({title: Trans.trans('commonjs-warning'), text: Trans.trans('commonjs-qdscgjlts'), ok: Trans.trans('commonjs-ok'), cancel: Trans.trans('common-cancel')},{size: 'sm'}).then(function (){
            MenuManagerService.deleteMenu({id: id}, function () {
                alertService.addSuccessAlert(Trans.trans('commonjs-sccgts'));
                $scope.getPage();
            });
        });
    };

}]);

App.controller('AddMenuManagerCtrl', ['$scope','$uibModalInstance','MenuManagerService','alertService','Trans',function($scope,$uibModalInstance,MenuManagerService,alertService,Trans) {

    //切换超市下拉框列表
    $scope.changeMenuType = function () {

        if(!$scope.menuTypeId){
            alertService.addErrorAlert(Trans.trans('commonjs-xzcdjbts'));
            return;
        }
        else if($scope.menuTypeId==0)
        {
            $scope.parent = [{id:0,name:Trans.trans('commonjs-djcdts')}];
            $scope.parentId = $scope.parent[0].id;
            return;
        }

        // 上级列表
        MenuManagerService.getMenuListByType({type: $scope.menuTypeId-1},function(data) {
            $scope.parent = data;
        });

    };


    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
    $scope.save = function () {
        if(!$scope.menuManager){
            alertService.addErrorAlert(Trans.trans('commonjs-cdxxts'));
            return;
        }
        if(!$scope.menuTypeId){
            alertService.addErrorAlert(Trans.trans('commonjs-cdjbts'));
            return;
        }
        if(!$scope.parentId&&!String($scope.parentId)){
            alertService.addErrorAlert(Trans.trans('commonjs-sjcdts'));
            return;
        }
        if(!$scope.menuManager.name){
            alertService.addErrorAlert(Trans.trans('commonjs-cdmcts'));
            return;
        }
        //默认为空字符串
        /*if(!$scope.menuManager.url){
            $scope.menuManager.url="";
         }
        //默认为空字符串
         if($scope.menuManager.icon){
             $scope.menuManager.icon="";
         }*/
        if($scope.menuManager.orderNo){
            var g=/^-?\d+$/;
            if(!g.test($scope.menuManager.orderNo)) {
                alertService.addErrorAlert(Trans.trans('commonjs-cdsxts'));
                return;
            }
        }
        else
        {
            //默认为0
            $scope.menuManager.orderNo=0;
        }


        MenuManagerService.addOrUpdate({ name: $scope.menuManager.name,url:$scope.menuManager.url,icon:$scope.menuManager.icon, orderNo: $scope.menuManager.orderNo,parent:$scope.parentId,type:$scope.menuTypeId,note: $scope.menuManager.name},function() {
            $uibModalInstance.close();
            alertService.addSuccessAlert(Trans.trans('commonjs-xzyhts'));
        });
    };

}]);

App.controller('EditMenuManagerCtrl',['$scope','$uibModalInstance','MenuManagerService','alertService','data','Trans',function($scope,$uibModalInstance,MenuManagerService,alertService,data,Trans) {

    //设置初始值
    $scope.menuManager = data;
    $scope.menuTypeId =data.type.toString();
    if($scope.menuTypeId==0)
    {
        $scope.parent = [{id:0,name:Trans.trans('commonjs-djcdts')}];
        $scope.parentId = $scope.parent[0].id;
    }
    else
    {
    MenuManagerService.getMenuListByType({type: $scope.menuTypeId-1},function(data) {
        $scope.parent = data;
        for(var p in data)
        {
            if(data[p].id==$scope.menuManager.parent)
            {
                $scope.parentId =data[p].id;
            }
        }
    });
    }
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };

    //切换超市下拉框列表
    $scope.changeMenuType = function () {

        if(!$scope.menuTypeId){
            alertService.addErrorAlert(Trans.trans('commonjs-xzcdjbts'));
            return;
        }
        else if($scope.menuTypeId==0)
        {
            $scope.parent = [{id:0,name:Trans.trans('commonjs-djcdts')}];
            $scope.parentId = $scope.parent[0].id;
            return;
        }

        // 上级列表
        MenuManagerService.getMenuListByType({type: $scope.menuTypeId-1},function(data) {
            $scope.parent = data;
        });

    };

    $scope.save = function () {
        if(!$scope.menuManager){
            alertService.addErrorAlert(Trans.trans('commonjs-cdxxts'));
            return;
        }
        if(!$scope.menuTypeId){
            alertService.addErrorAlert(Trans.trans('commonjs-cdjbts'));
            return;
        }
        if(!$scope.parentId&&!String($scope.parentId)){
            alertService.addErrorAlert(Trans.trans('commonjs-sjcdts'));
            return;
        }
        if(!$scope.menuManager.name){
            alertService.addErrorAlert(Trans.trans('commonjs-cdmcts'));
            return;
        }
        //默认为空字符串
        /*if(!$scope.menuManager.url){
         $scope.menuManager.url="";
         }
         //默认为空字符串
         if($scope.menuManager.icon){
         $scope.menuManager.icon="";
         }*/
        if($scope.menuManager.orderNo){
            var g=/^-?\d+$/;
            if(!g.test($scope.menuManager.orderNo)) {
                alertService.addErrorAlert(Trans.trans('commonjs-cdsxts'));
                return;
            }
        }
        else
        {
            //默认为0
            $scope.menuManager.orderNo=0;
        }

        MenuManagerService.addOrUpdate({id: $scope.menuManager.id,  name: $scope.menuManager.name,url:$scope.menuManager.url,icon:$scope.menuManager.icon, orderNo: $scope.menuManager.orderNo,parent:$scope.parentId,type:$scope.menuTypeId,note: $scope.menuManager.name},function() {
            $uibModalInstance.close();
            alertService.addSuccessAlert(Trans.trans('commonjs-xgcgts'));
        });

    };

}]);
