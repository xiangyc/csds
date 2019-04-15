'use strict';
App.controller('ActivityListCtrl', ['$scope','$uibModal','alertService','$confirm','ActivityService','Trans',function ($scope,$uibModal,alertService,$confirm,ActivityService,Trans) {
    $scope.activity=[];
	//select中默认显示数
    $scope.viewby = '10';
    //当前页数，默认是第1页
    $scope.currentPage = 1;
    //每页显示记录条数
    $scope.itemsPerPage = $scope.viewby;
    //活动
    $scope.activity = {};
    
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
        	name:$scope.name,
        	status:$scope.status,
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        ActivityService.queryActivityList(params, function (data) {
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
        $scope.status = null;
    }; 
    
	
    //添加活动
    $scope.addActivity = function () {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/operation/add-activity.html',
            controller: 'AddActivityCtrl',
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
    //添加门店弹出窗口
    /*$scope.showCreateForm = function (size) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/operation/add-activity.html',
            controller: 'AddActivityCtrl',
            backdrop: "static",
            size: size
        });
        uibModalInstance.result.then(function () {
        	$scope.getPage();
        });
    };*/
    
    //修改门店弹出窗口
    $scope.showEditForm = function (size) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/operation/edit-activity.html',
            controller: 'EditActivityCtrl',
            backdrop: "static",
            resolve: {
                items: function () {
                    return $scope.activity;
                }
            },
            size:size
        });
        uibModalInstance.result.then(function () {
        	$scope.getPage();
        });
    };

    //修改门店
    $scope.editActivity = function (id) {
    	$scope.activity =  ActivityService.queryActivityById({id: id},function() {
            $scope.showEditForm('md');
        }); 

    };

    //上架
    $scope.upShelf = function (id) {
        $confirm({title: Trans.trans('commonjs-warning'), text: Trans.trans('commonjs-qrsjgmdts'),ok:Trans.trans('commonjs-ok'),cancel: Trans.trans('common-cancel')},{size: 'sm'}).then(function () {
            ActivityService.changeStatus({id: id,status:1}, function () {
                $scope.query();
                alertService.addSuccessAlert(Trans.trans('commonjs-sjspcg'));
            });
        });
    };

    //下架
    $scope.offShelf = function (id) {
        $confirm({title: Trans.trans('commonjs-warning'), text: Trans.trans('commonjs-qrxjgmdts'),ok:Trans.trans('commonjs-ok'),cancel: Trans.trans('common-cancel')},{size: 'sm'}).then(function () {
            ActivityService.changeStatus({id: id,status:-1}, function () {
                $scope.query();
                alertService.addSuccessAlert(Trans.trans('commonjs-xjspcg'));
            });
        });
    };

}]);
//添加门店控制器
App.controller('AddActivityCtrl',  ['$scope','$uibModalInstance','alertService','$http','ActivityService','$filter','SuperMarketService','StoreService','Trans',function ($scope,$uibModalInstance,alertService,$http,ActivityService,$filter,SuperMarketService,StoreService,Trans) {

    /*
    var ids;
   $scope.init = function () {
    	SuperMarketService.getSuperMarketList(function(data) {
        	//$scope.supermarket = data;
            $("#food").html("");
            $.each(data, function(index, item) {
                $("#food").append('<option value="' + item.id + '">' + item.name + '</option>');
            });
            $("#food").multiselect("destroy").multiselect({
                // 自定义参数，按自己需求定义
                nonSelectedText : '--请选择--',
                maxHeight : 350,
                includeSelectAllOption : false,
                numberDisplayed : 7
            });
        });
    }*/
    $scope.changeSupermarket=function(){
        $("#food").html("");
            //首页广告加载超市
            if ($scope.activity.location&&$scope.activity.location==2)
             {
                 SuperMarketService.getSuperMarketList(function(data) {
                     $.each(data, function (index, item) {
                         $("#food").append('<option value="' + item.id + '">' + item.name + '</option>');
                     });
                     $("#food").attr("multiple", "multiple");
                     $("#food").multiselect("destroy").multiselect({
                         // 自定义参数，按自己需求定义
                         nonSelectedText: '--请选择--',
                         maxHeight: 350,
                         includeSelectAllOption: false,
                         numberDisplayed: 7
                     });
                 });
            }
            //附近的人在买 加载门店,单选
           else if ($scope.activity.location&&$scope.activity.location==1)
            {
                StoreService.getAllStoreList(function(data) {
                    $.each(data, function (index, item) {
                        $("#food").append('<option value="' + item.id + '">' + item.name + '</option>');
                    });
                    $("#food").removeAttr("multiple");
                    $("#food").multiselect("destroy").multiselect({
                        // 自定义参数，按自己需求定义
                        placeholder: "--请选择--",
                        single: true
                    });
                });
            }
            else
            {
             $("#food").multiselect("destroy").multiselect({
                // 自定义参数，按自己需求定义
                nonSelectedText: '--请选择--',
                maxHeight: 350,
                includeSelectAllOption: false,
                numberDisplayed: 7
              });
            }

    };

    $scope.save = function () {

    	if(!$scope.activity){
            alertService.addErrorAlert(Trans.trans('commonjs-hdxxts'));
            return;
        }
        if(!$scope.activity.name){
            alertService.addErrorAlert(Trans.trans('commonjs-hdmcts'));
            return;
        }
        
        if(!$scope.activity.startTime){
        	alertService.addErrorAlert(Trans.trans('commonjs-xzhdksts'));
            return;
        }
        
        if(!$scope.activity.endTime){
        	alertService.addErrorAlert(Trans.trans('commonjs-xzhdjsts'));
            return;
        }
        
        if(!$scope.activity.location){
        	alertService.addErrorAlert(Trans.trans('commonjs-hdtpwzts'));
            return;
        }
        if(!$scope.activity.content){
        	$scope.activity.content = "";
        }
        var selectedSupermarket = [];
        $('#food option:selected').each(function () {
            selectedSupermarket.push($(this).val());
        });
        if(selectedSupermarket.length<1){
            alertService.addErrorAlert(Trans.trans('commonjs-xzyhts'));
            return;
        }
        var formData = new FormData();
        var file = document.getElementById("changeImg").files[0];
      	formData.append("file", file);
      	formData.append("name", $scope.activity.name);
      	formData.append("content", $scope.activity.content);
      	formData.append("location", $scope.activity.location);
      	formData.append("startTime", $filter('date')($scope.activity.startTime, 'yyyy-MM-dd'));
      	formData.append("endTime", $filter('date')($scope.activity.endTime, 'yyyy-MM-dd'));
      	formData.append("supermarket", selectedSupermarket.toString());
      	
      	if(!file){
        	alertService.addErrorAlert(Trans.trans('commonjs-hdtpts'));
        	return;
      	}
      	$http.post(App.config.urlRoot + '/activity/addOrUpdate',formData, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
        }).success(function () {
            //关闭窗口
            $uibModalInstance.close();
            alertService.addSuccessAlert(Trans.trans('commonjs-xzhdts'));
        });
    };
    
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
//修改门店控制器
App.controller('EditActivityCtrl',  ['$scope','$uibModalInstance','alertService', '$http','items','ActivityService','$filter','SuperMarketService','StoreService','Trans',function ($scope,$uibModalInstance,alertService,$http,items,ActivityService,$filter,SuperMarketService,StoreService,Trans) {
	
	//设置初始值
    $scope.activity = items;
    $scope.init = function () {
        //加载首页呈现的位置
        $scope.location = $scope.activity.location.toString();
        //加载门店或者超市
        $scope.changeSupermarket($scope.activity.supermarket);
    };
    
    //联动事件
    $scope.changeSupermarket=function(selected){
        $("#food").html("");
        //首页广告加载超市
        if ($scope.location&&$scope.location==2)
        {
            SuperMarketService.getSuperMarketList(function(data) {
                $.each(data, function (index, item) {
                    if(selected&&selected.indexOf(item.id)>-1)
                    {
                        $("#food").append('<option value="' + item.id + '" selected>' + item.name + '</option>');
                    }
                    else
                    {
                        $("#food").append('<option value="' + item.id + '">' + item.name + '</option>');
                    }

                });
                $("#food").attr("multiple", "multiple");
                $("#food").multiselect("destroy").multiselect({
                    // 自定义参数，按自己需求定义
                    nonSelectedText: '--请选择--',
                    maxHeight: 350,
                    includeSelectAllOption: false,
                    numberDisplayed: 7
                });
            });
        }
        //附近的人在买 加载门店,单选
        else if ($scope.location&&$scope.location==1)
        {
            StoreService.getAllStoreList(function(data) {
                $.each(data, function (index, item) {
                    if(selected&&selected.indexOf(item.id)>-1)
                    {
                        $("#food").append('<option value="' + item.id + '" selected>' + item.name + '</option>');
                    }
                    else
                    {
                        $("#food").append('<option value="' + item.id + '">' + item.name + '</option>');
                    }
                });
                $("#food").removeAttr("multiple");
                $("#food").multiselect("destroy").multiselect({
                    // 自定义参数，按自己需求定义
                    placeholder: "--请选择--",
                    single: true
                });
            });
        }
        else
        {
            $("#food").multiselect("destroy").multiselect({
                // 自定义参数，按自己需求定义
                nonSelectedText: '--请选择--',
                maxHeight: 350,
                includeSelectAllOption: false,
                numberDisplayed: 7
            });
        }

    };

   	//修改门店
    $scope.save = function () {
        if(!$scope.activity){
            alertService.addErrorAlert(Trans.trans('commonjs-hdxxts'));
            return;
        }
        if(!$scope.activity.name){
            alertService.addErrorAlert(Trans.trans('commonjs-hdmcts'));
            return;
        }

        if($("#startTime").val()==""){
            alertService.addErrorAlert(Trans.trans('commonjs-xzhdksts'));
            return;
        }

        if($("#endTime").val()==""){
            alertService.addErrorAlert(Trans.trans('commonjs-xzhdjsts'));
            return;
        }

        if(!$scope.activity.location){
            alertService.addErrorAlert(Trans.trans('commonjs-hdtpwzts'));
            return;
        }
        if(!$scope.activity.content){
            $scope.activity.content = "";
        }
        var selectedSupermarket = [];
        $('#food option:selected').each(function () {
            selectedSupermarket.push($(this).val());
        });
        if(selectedSupermarket.length<1){
            alertService.addErrorAlert(Trans.trans('commonjs-xzyhts'));
            return;
        }
        
        var formData = new FormData();
        var file = document.getElementById("changeImg").files[0];
        formData.append("id", $scope.activity.id);
      	formData.append("file", file);
      	formData.append("name", $scope.activity.name);
      	formData.append("content", $scope.activity.content);
        formData.append("location", $scope.location);
      	//formData.append("startTime", $filter('date')($scope.activity.startTime, 'yyyy-MM-dd'));
        formData.append("startTime", $("#startTime").val());
      	//formData.append("endTime", $filter('date')($scope.activity.endTime, 'yyyy-MM-dd'));
        formData.append("endTime", $("#endTime").val());
        formData.append("supermarket", selectedSupermarket.toString());
      	
      	$http.post(App.config.urlRoot + '/activity/addOrUpdate',formData, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
        }).success(function () {
            //关闭窗口
            $uibModalInstance.close();
            alertService.addSuccessAlert(Trans.trans('commonjs-xgcgts'));
        });
    };
    
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);