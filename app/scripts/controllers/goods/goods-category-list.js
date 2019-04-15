'use strict';
App.controller('GoodsCategoryListCtrl', ['$scope','$uibModal','alertService','$confirm','GoodsCategoryService','Trans',function ($scope,$uibModal,alertService,$confirm,GoodsCategoryService,Trans) {
	
	//select中默认显示数
    $scope.viewby = '100';
    //当前页数，默认是第1页
    $scope.currentPage = 1;
    //每页显示记录条数
    $scope.itemsPerPage = $scope.viewby;
    //商品种类
    $scope.goodscategory = {};
    
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
    
//	$scope.getInit = function () {
//		GoodsCategoryService.getParentGoodsCategoryList(function(data) {
//	        $scope.parentCategory = data;
//	        if(data.length >= 1){
//	        	$scope.parent = data[0].id;//如果想要第一个值
//	        	$scope.getPage();
//	        }
//	        
//  	});
//  };
//  
    //分页
    $scope.getPage = function() {
//      if(!$scope.parent)
//      {
//          alertService.addSuccessAlert('请选择一级商品类型!');
//          return;
//      }
        //查询参数
        var params = {
        	name: $scope.name,
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        GoodsCategoryService.queryGoodsCategoryList(params, function (data) {
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
    };
    
    
    $scope.showparams = function (id) {
        if ($scope.showId == id) {
            $scope.showId = 0;        
        }else {
            $scope.showId = id;
        }
    };
    
    $scope.showThirdParams = function (id) {
        if ($scope.showThirdId == id) {
            $scope.showThirdId = 0;        
        }else {
            $scope.showThirdId = id;
        }
    };
    
    $scope.showFourParams = function (id) {
    	//alert(JSON.stringify(id));
        if ($scope.showFourId == id) {
            $scope.showFourId = 0;        
        }else {
            $scope.showFourId = id;
        }
    };
	
    $scope.addGoodsCategory = function () {
        $scope.showCreateForm('md');
    };
    //添加门店弹出窗口
    $scope.showCreateForm = function (size) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/goods/add-goods-category.html',
            controller: 'AddGoodsCategoryCtrl',
            backdrop: "static",
            size: size
        });
        uibModalInstance.result.then(function () {
        	$scope.getPage();
        	$scope.getInit();
        });
    };
    
    //修改门店弹出窗口
    $scope.showEditForm = function (size) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/goods/edit-goods-category.html',
            controller: 'EditGoodsCategoryCtrl',
            backdrop: "static",
            resolve: {
                items: function () {
                    return $scope.goodscategory;
                }
            },
            size:size
        });
        uibModalInstance.result.then(function () {
        	$scope.getPage();
        });
    };

    $scope.deleteGoodsCategory = function (id) {
        $confirm({title: Trans.trans('commonjs-warning'), text: Trans.trans('commonjs-qdscgjlts'),ok:Trans.trans('commonjs-ok'),cancel: Trans.trans('common-cancel')},{size: 'sm'}).then(function () {
        	
        	GoodsCategoryService.deleteCategory({id: id}, function (data) {
        		
        		if(data.message){
            		alertService.addErrorAlert(Trans.trans(data.message));
            	} else {
            		$scope.query();
                	alertService.addSuccessAlert(Trans.trans('commonjs-sccgts'));
            	}
            });
        });
    };

    $scope.editGoodsCategory = function (id) {
    	$scope.goodscategory =  GoodsCategoryService.queryGoodsCategoryById({id: id},function() {
            $scope.showEditForm('md');
        }); 

    };

}]);
//添加门店控制器
App.controller('AddGoodsCategoryCtrl',  ['$scope','$uibModalInstance','alertService','$http','GoodsCategoryService','Trans',function ($scope,$uibModalInstance,alertService,$http,GoodsCategoryService,Trans) {
    
    $scope.changeLevel = function () {
    	
    	if(!$scope.level){
            alertService.addErrorAlert(Trans.trans('commonjs-xzlxjb'));
            return;
        }
        if($scope.level > 1){
        	
        	GoodsCategoryService.getParentGoodsCategoryList({level: $scope.level - 1},function(data) {
	        	$scope.parentCategory = data;	        
    		});
        } else {
        	$scope.parentCategory = {};
        }
    };
    
    $scope.save = function () {
    	if(!$scope.goodscategory){
            alertService.addErrorAlert(Trans.trans('commonjs-splxxx'));
            return;
        }
        if(!$scope.goodscategory.name){
            alertService.addErrorAlert(Trans.trans('commonjs-splxmc'));
            return;
        }
        
        if($scope.level > 1){
        	if(!$scope.parent){
	    		alertService.addErrorAlert(Trans.trans('commonjs-xzssfjts'));
	        	return;
       		}        	
        } else {
        	$scope.parent = 0;
        }
        
        if(!$scope.goodscategory.note){
            $scope.goodscategory.note = "";
        }
        
        
        var formData = new FormData();
        var file = document.getElementById("changeImg").files[0];
      	formData.append("file", file);
      	formData.append("name", $scope.goodscategory.name);
      	formData.append("note", $scope.goodscategory.note);
      	formData.append("sort", $scope.goodscategory.sort);
      	formData.append("level", $scope.level);
      	formData.append("parent", $scope.parent);
      	
      	if(!file){
        	alertService.addErrorAlert(Trans.trans('commonjs-splxtb'));
        	return;
      	}
      	$http.post(App.config.urlRoot + '/goodscategory/addOrUpdate',formData, {
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
App.controller('EditGoodsCategoryCtrl',  ['$scope','$uibModalInstance','alertService', '$http','items','GoodsCategoryService','Trans',function ($scope,$uibModalInstance,alertService,$http,items,GoodsCategoryService,Trans) {
	
	//设置初始值
    $scope.goodscategory = items;
    
    $scope.level = $scope.goodscategory.level;
    
//  $scope.getInit = function () {
//		GoodsCategoryService.getParentGoodsCategoryList(function(data) {
//	        $scope.parentCategory = data;
//	        if(data.length >= 1){
//	        	$scope.parent = $scope.goodscategory.parent;
//	        }
//	        
//  	});
//  };
    
   	//修改门店
    $scope.save = function () {
        if(!$scope.goodscategory){
            alertService.addErrorAlert(Trans.trans('commonjs-splxxx'));
            return;
        }
        if(!$scope.goodscategory.name){
            alertService.addErrorAlert(Trans.trans('commonjs-splxmc'));
            return;
        }
        
        if(!$scope.goodscategory.note){
            $scope.goodscategory.note = "";
        }
        
        var formData = new FormData();
        var file = document.getElementById("changeImg").files[0];
      	formData.append("file", file);
      	formData.append("id", $scope.goodscategory.id);
      	formData.append("name", $scope.goodscategory.name);
      	formData.append("note", $scope.goodscategory.note);
      	formData.append("sort", $scope.goodscategory.sort);
      	formData.append("level", $scope.goodscategory.level);
      	formData.append("parent", $scope.goodscategory.parent);
      	
      	$http.post(App.config.urlRoot + '/goodscategory/addOrUpdate',formData, {
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