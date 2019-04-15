/**
 * xiangyc
 */
'use strict';
App.controller('BrandListCtrl', ['$scope','$uibModal','$confirm','alertService','$filter','BrandService','Trans',function($scope,$uibModal,$confirm,alertService,$filter,BrandService,Trans) {
    $scope.brand={};
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
            name: $scope.name,
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        BrandService.queryBrandList(params, function (data) {
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
	
	$scope.reset = function() {
        $scope.name = null;
    };
    
    //切换pageSize
    $scope.setItemsPerPage = function (num) {
        $scope.itemsPerPage = num;
        $scope.currentPage = 1; //reset to first paghe
        $scope.getPage();
    };

    $scope.editBrand = function (id,typeId) {
        $scope.brand =  BrandService.queryBrandById({id: id},function() {
            $scope.showEditForm(typeId);
        });
    };

    $scope.showEditForm = function (typeId) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/goods/edit-brand.html',
            controller: 'EditBrandCtrl',
            backdrop: "static",
            resolve: {
                data: function () {
                    return $scope.brand;
                },
                typeId: typeId
            },
            size: 'md'
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };

    $scope.addBrand = function () {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/goods/add-brand.html',
            controller: 'AddBrandCtrl',
            backdrop: "static",
            size: 'md'
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };

    $scope.deleteBrand = function (id) {
        $confirm({title: Trans.trans('commonjs-warning'), text: Trans.trans('commonjs-qdscgjlts'), ok: Trans.trans('commonjs-ok'), cancel: Trans.trans('common-cancel')},{size: 'sm'}).then(function (){
            BrandService.deleteBrand({id: id}, function (data) {
            	if(data.message){
            		alertService.addErrorAlert(Trans.trans(data.message));
            	} else {
            		alertService.addSuccessAlert(Trans.trans('commonjs-sccgts'));
                	$scope.getPage();
            	}
                
            });
        });
    };

}]);

App.controller('AddBrandCtrl', ['$scope','$uibModalInstance','BrandService','alertService','$http','GoodsCategoryService','Trans',function($scope,$uibModalInstance,BrandService,alertService,$http,GoodsCategoryService,Trans) {
	
	$scope.getInit = function () {
    	
    	// 商品2级类型列表
    	GoodsCategoryService.getAllProductList(function(data) {
	        $scope.goodstype = data;
	        
    	});

    };
	
    $scope.save = function () {
    
    	  
        if(!$scope.brand){
            alertService.addErrorAlert(Trans.trans('commonjs-ppxxts'));
            return;
        }
        
        if(!$scope.typeId){
    		alertService.addErrorAlert(Trans.trans('commonjs-xzsplx'));
        	return;
       	}
       	
        if(!$scope.brand.name){
            alertService.addErrorAlert(Trans.trans('commonjs-spppmc'));
            return;
        }
        
        if(!$scope.brand.note){
            $scope.brand.note = "";
        }

        var formData = new FormData();
        var file = document.getElementById("changeImg").files[0];
        formData.append("file", file);
        formData.append("name", $scope.brand.name);
        formData.append("note", $scope.brand.note);
        formData.append("typeId", $scope.typeId);
        formData.append("sort", $scope.brand.sort);

        if(!file){
            alertService.addErrorAlert(Trans.trans('commonjs-sppptbts'));
            return;
        }
        $http.post(App.config.urlRoot + '/brand/addOrUpdate',formData, {
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

App.controller('EditBrandCtrl',['$scope','$uibModalInstance','BrandService','data','alertService','$http','Trans','GoodsCategoryService','typeId',function($scope,$uibModalInstance,BrandService,data,alertService,$http,Trans,GoodsCategoryService,typeId) {
	
	
	$scope.getInit = function () {
    	// 商品2级类型列表
    	GoodsCategoryService.getAllProductList(function(data) {
	        $scope.goodstype = data;
	        $scope.typeId = typeId;
	        
    	});

    };
    
    //设置初始值
    $scope.brand = data;

    //修改门店
    $scope.save = function () {
    
    	if(!$scope.typeId){
    		alertService.addErrorAlert(Trans.trans('commonjs-xzsplx'));
        	return;
       	}
       	
        if(!$scope.brand){
            alertService.addErrorAlert(Trans.trans('commonjs-ppxxts'));
            return;
        }
        if(!$scope.brand.name){
            alertService.addErrorAlert(Trans.trans('commonjs-spppmc'));
            return;
        }

		
		if(!$scope.brand.note){
            $scope.brand.note = "";
        }
        
        var formData = new FormData();
        var file = document.getElementById("changeImg").files[0];
        formData.append("file", file);
        formData.append("id", $scope.brand.id);
        formData.append("name", $scope.brand.name);
        formData.append("note", $scope.brand.note);
        formData.append("typeId", $scope.typeId);
        formData.append("sort", $scope.brand.sort);

        $http.post(App.config.urlRoot + '/brand/addOrUpdate',formData, {
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
