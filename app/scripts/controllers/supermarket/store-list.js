'use strict';
App.controller('StoreListCtrl', ['$scope','$uibModal','alertService','$confirm','SuperMarketService','StoreService','$filter','Trans',function ($scope,$uibModal,alertService,$confirm,SuperMarketService,StoreService,$filter,Trans) {
	
	//select中默认显示数
    $scope.viewby = '10';
    //当前页数，默认是第1页
    $scope.currentPage = 1;
    //每页显示记录条数
    $scope.itemsPerPage = $scope.viewby;
    //门店
    $scope.supermarketstore = {};
    
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
	
	$scope.getInit = function () {
		SuperMarketService.getSuperMarketList(function(data) {
	        $scope.supermarket = data;
	        if(data.length >= 1){
				$scope.type = data[0].type;
	        	$scope.getPage();
	        }
	        
  	});
  };
    
    //分页
    $scope.getPage = function() {
        //查询参数
        var params = {
        	name:$scope.name,
        	marketName:$scope.marketName,
        	startDate: $filter('date')($scope.startDate, 'yyyy-MM-dd'),
            endDate: $filter('date')($scope.endDate, 'yyyy-MM-dd'),
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        StoreService.querySuperMarketStoreList(params, function (data) {
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
        $scope.marketName = null;
        $scope.startDate = null;
        $scope.endDate = null;
    }; 
    
	
    //添加门店
    $scope.addStore = function () {
    	if($scope.type == 2){
    		if($scope.totalItems >= 1){
    			alertService.addErrorAlert(Trans.trans('commonjs-sycsxzts'));
            	return;
    		} else {
    			$scope.showCreateForm('md');
    		}
    	} else {
    		$scope.showCreateForm('md');
    	}
        
    };
    //添加门店弹出窗口
    $scope.showCreateForm = function (size) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/supermarket/add-store.html',
            controller: 'AddStoreCtrl',
            backdrop: "static",
            size: size
        });
        uibModalInstance.result.then(function () {
        	$scope.getPage();
        });
    };
    
    //修改门店弹出窗口
    $scope.showEditForm = function (size) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/supermarket/edit-store.html',
            controller: 'EditStoreCtrl',
            backdrop: "static",
            resolve: {
                items: function () {
                    return $scope.supermarketstore;
                }
            },
            size:size
        });
        uibModalInstance.result.then(function () {
        	$scope.getPage();
        });
    };
    //删除门店绑定事件
    $scope.deleteStore = function () {
        $confirm({title: '确认', text: '确定删除该门店吗？',ok:'确认',cancel: '取消'},{size: 'sm'}).then(function () {
            alertService.addSuccessAlert('删除门店成功!');
        });
    };
    //修改门店
    $scope.editStore = function (id) {
    	$scope.supermarketstore =  StoreService.querySuperMarketStoreById({id: id},function() {
            $scope.showEditForm('md');
        }); 

    };

	$scope.upShelf = function (id) {
    	
    	$confirm({title: Trans.trans('commonjs-warning'), text: Trans.trans('commonjs-qrsjgmdts'),ok:Trans.trans('commonjs-ok'),cancel: Trans.trans('common-cancel')},{size: 'sm'}).then(function () {
            StoreService.changeStatus({id: id,status:1}, function () {
                $scope.query();
                alertService.addSuccessAlert(Trans.trans('commonjs-sjspcg'));
            });
        });
    };

    $scope.offShelf = function (id) {
    	
    	$confirm({title: Trans.trans('commonjs-warning'), text: Trans.trans('commonjs-qrxjgmdts'),ok:Trans.trans('commonjs-ok'),cancel: Trans.trans('common-cancel')},{size: 'sm'}).then(function () {
            StoreService.changeStatus({id: id,status:-1}, function () {
                $scope.query();
                alertService.addSuccessAlert(Trans.trans('commonjs-xjspcg'));
                
            });
        });
    
    };
    
}]);
//添加门店控制器
App.controller('AddStoreCtrl',  ['$scope','$uibModalInstance','alertService','$http','SuperMarketService','Trans',function ($scope,$uibModalInstance,alertService,$http,SuperMarketService,Trans) {
	
	var supermarketId;
	$scope.getInit = function () {
		SuperMarketService.getSuperMarketList(function(data) {
	        $scope.supermarket = data;
	        if(data.length >= 1){
	       		supermarketId = data[0].id;//如果想要第一个值
				$scope.marketName = data[0].name;
	        }       
    	});
    };
    
    $scope.save = function () {
    	if(!$scope.supermarketstore){
            alertService.addErrorAlert(Trans.trans('commonjs-mdxxts'));
            return;
        }
        if(!$scope.supermarketstore.name){
            alertService.addErrorAlert(Trans.trans('commonjs-mdmcts'));
            return;
        }
        
        if(!$scope.supermarketstore.summary){
            $scope.supermarketstore.summary = "";
        }
        
        var formData = new FormData();
        var file = document.getElementById("changeImg").files[0];
      	formData.append("file", file);
      	formData.append("name", $scope.supermarketstore.name);
      	formData.append("promotion", $scope.supermarketstore.promotion);
      	formData.append("summary", $scope.supermarketstore.summary);
      	formData.append("address", $scope.supermarketstore.address);
      	formData.append("supermarketId", supermarketId);
      	
      	if(!file){
        	alertService.addErrorAlert(Trans.trans('commonjs-mdtbts'));
        	return;
      	}
      	$http.post(App.config.urlRoot + '/supermarketstore/addOrUpdate',formData, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
        }).success(function () {
            //关闭窗口
            $uibModalInstance.close();
            alertService.addSuccessAlert(Trans.trans('commonjs-xzyhts'));
        });
    };
    
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
//修改门店控制器
App.controller('EditStoreCtrl',  ['$scope','$uibModalInstance','alertService', '$http','items','SuperMarketService','Trans',function ($scope,$uibModalInstance,alertService,$http,items,SuperMarketService,Trans) {
	
	//设置初始值
    $scope.supermarketstore = items;
    
    var supermarketId;
    
    $scope.getInit = function () {
		SuperMarketService.getSuperMarketList(function(data) {
	        $scope.supermarket = data;
	        if(data.length >= 1){
	       		supermarketId = data[0].id;//如果想要第一个值
				$scope.marketName = data[0].name;
	        }
	        
    	});
    };
    
   	//修改门店
    $scope.save = function () {
        if(!$scope.supermarketstore){
            alertService.addErrorAlert(Trans.trans('commonjs-mdxxts'));
            return;
        }
        if(!$scope.supermarketstore.name){
            alertService.addErrorAlert(Trans.trans('commonjs-mdmcts'));
            return;
        }
        
        if(!$scope.supermarketstore.summary){
            $scope.supermarketstore.summary = "";
        }
        
        var formData = new FormData();
        var file = document.getElementById("changeImg").files[0];
      	formData.append("file", file);
      	formData.append("id", $scope.supermarketstore.id);
      	formData.append("name", $scope.supermarketstore.name);
      	formData.append("promotion", $scope.supermarketstore.promotion);
      	formData.append("summary", $scope.supermarketstore.summary);
      	formData.append("address", $scope.supermarketstore.address);
      	formData.append("supermarketId", supermarketId);
      	
      	$http.post(App.config.urlRoot + '/supermarketstore/addOrUpdate',formData, {
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