'use strict';
App.controller('GoodsListCtrl', ['$scope','$uibModal','alertService','$confirm','GoodsService','SuperMarketService','StoreService','GoodsCategoryService','Trans',function ($scope,$uibModal,alertService,$confirm,GoodsService,SuperMarketService,StoreService,GoodsCategoryService,Trans) {
	
	//select中默认显示数
    $scope.viewby = '10';
    //当前页数，默认是第1页
    $scope.currentPage = 1;
    //每页显示记录条数
    $scope.itemsPerPage = $scope.viewby;
    //商品
    $scope.goods = {};
    
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
	
    var marketId;
    
	$scope.getInit = function () {

		// 所属超市列表
		SuperMarketService.getSuperMarketList(function(data) {
	        $scope.supermarket = data;
	        if(data.length >= 1){
	        	$scope.supermarketId = data[0].id;//如果想要第一个值

	        	// 所属门店列表
	        	StoreService.getStoreList({supermarketId: $scope.supermarketId},function(data) {
			        $scope.supermarketstore = data;
			        if(data.length >= 1){
			        	$scope.supermarketStoreId = data[0].id;//如果想要第一个值
			        	$scope.getPage();
			        }

		    	});
	        }

    	});

    	// 商品2级类型列表
    	GoodsCategoryService.getAllProductList(function(data) {
	        $scope.goodstype = data;

    	});

    };
    
    //分页
    $scope.getPage = function() {
        //查询参数
        var params = {
        	supermarketStoreId: $scope.supermarketStoreId,
        	type: $scope.type,
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        GoodsService.queryGoodsList(params, function (data) {
            $scope.totalItems = data.totalItems;
            $scope.data = data.items;
        });
        
        marketId = $scope.supermarketId;
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
    
	
    $scope.addGoods = function () {
        $scope.showCreateForm('md');
    };

    $scope.showCreateForm = function (size) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/goods/add-goods.html',
            controller: 'AddGoodsCtrl',
            backdrop: "static",
            size: size
        });
        uibModalInstance.result.then(function () {
        	$scope.getPage();
        });
    };
    
    $scope.showEditForm = function (size) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/goods/edit-goods.html',
            controller: 'EditGoodsCtrl',
            backdrop: "static",
            resolve: {
                items: function () {
                    return $scope.goods;
                },
                MarketId: function () {
                    return marketId;
                },
            },
            size:size
        });
        uibModalInstance.result.then(function () {
        	$scope.getPage();
        });
    };

//  $scope.deleteGoods = function () {
//      $confirm({title: '确认', text: '确定删除该门店吗？',ok:'确认',cancel: '取消'},{size: 'sm'}).then(function () {
//          alertService.addSuccessAlert('删除门店成功!');
//      });
//  };

    $scope.editGoods = function (id) {
    	
    	if(!$scope.supermarketId){
            alertService.addErrorAlert(Trans.trans('commonjs-xzsscs'));
            return;
        }
        
    	$scope.goods =  GoodsService.queryGoodsById({id: id},function() {
            $scope.showEditForm('md');
        }); 

    };
    
    $scope.upShelf = function (id) {
    	
    	$confirm({title: Trans.trans('commonjs-warning'), text: Trans.trans('commonjs-qrsjgmdts'),ok:Trans.trans('commonjs-ok'),cancel: Trans.trans('common-cancel')},{size: 'sm'}).then(function () {
            GoodsService.changeStatus({id: id,status:1}, function () {
                $scope.query();
                alertService.addSuccessAlert(Trans.trans('commonjs-sjspcg'));
            });
        });
    };

    $scope.offShelf = function (id) {
    	
    	$confirm({title: Trans.trans('commonjs-warning'), text: Trans.trans('commonjs-qrxjgmdts'),ok:Trans.trans('commonjs-ok'),cancel: Trans.trans('common-cancel')},{size: 'sm'}).then(function () {
            GoodsService.changeStatus({id: id,status:-1}, function () {
                $scope.query();
                alertService.addSuccessAlert(Trans.trans('commonjs-xjspcg'));
            });
        });
    
    };

    //根据超市加载门店
    $scope.changeSupermarket=function() {
        if ($scope.supermarketId) {
        // 所属门店列表
            StoreService.getStoreList({supermarketId: $scope.supermarketId}, function (data) {
                $scope.supermarketstore = data;
              if (data.length >= 1) {
                  $scope.supermarketStoreId = data[0].id;//如果想要第一个值
                  $scope.getPage();
              }
            });
      } else {
      	$scope.supermarketstore = null;
      }
    };


}]);
//添加门店控制器
App.controller('AddGoodsCtrl',  ['$scope','$uibModalInstance','alertService','$http','GoodsService','SuperMarketService','StoreService','GoodsCategoryService','BrandService','Trans',function ($scope,$uibModalInstance,alertService,$http,GoodsService,SuperMarketService,StoreService,GoodsCategoryService,BrandService,Trans) {
    
    //切换超市下拉框列表
    $scope.changeSuperMarket = function () {
    	
    	if(!$scope.supermarketId){
            alertService.addErrorAlert(Trans.trans('commonjs-xzsscs'));
            return;
        }
        
        // 所属门店列表
    	StoreService.getStoreList({supermarketId: $scope.supermarketId},function(data) {
	        $scope.supermarketstore = data; 
    	});


    };
    
        
    
    //根据商品类型加载品牌
    $scope.changeGoodType=function() {
        if ($scope.type) {
        	// 所属品牌
            BrandService.getTypeList({typeId: $scope.type}, function (data) {
                $scope.brands = data;
            });
      	} else {
      		$scope.brands = null;
      	}
    };
   
   $scope.getInit = function () {
		
		// 所属超市列表
		SuperMarketService.getSuperMarketList(function(data) {
	        $scope.supermarket = data;
	        
    	});
    	
    	// 商品2级类型列表
    	GoodsCategoryService.getAllProductList(function(data) {
	        $scope.goodstype = data;
	        
    	});

       //品牌
//     GoodsService.getBrandList(function(data) {
//         $scope.brands = data;
//
//     });
    };
    
    $scope.save = function () {
    	if(!$scope.goods){
            alertService.addErrorAlert(Trans.trans('commonjs-spxxts'));
            return;
        }
        if(!$scope.supermarketId){
            alertService.addErrorAlert(Trans.trans('commonjs-xzsscs'));
            return;
        }
        if(!$scope.supermarketStoreId){
            alertService.addErrorAlert(Trans.trans('commonjs-xzssmd'));
            return;
        }
        if(!$scope.goods.name){
            alertService.addErrorAlert(Trans.trans('commonjs-spmcts'));
            return;
        }
        if(!$scope.type){
            alertService.addErrorAlert(Trans.trans('commonjs-splxts'));
            return;
        }
        if(!$scope.brand){
            alertService.addErrorAlert(Trans.trans('commonjs-spppmc'));
            return;
        }

		var g=/^-?\d+$/;
		
		var g2=/^\d+(\.\d{0,2})?$/;
		
        if($scope.goods.price){

            if(!g2.test($scope.goods.price)) {
                alertService.addErrorAlert(Trans.trans('commonjs-spjgts'));
                return;
            }
        }
        if($scope.goods.priceDiscount){

            if(!g2.test($scope.goods.priceDiscount)) {
                alertService.addErrorAlert(Trans.trans('commonjs-spyhjgts'));
                return;
            }
        }
        if($scope.goods.stock){

            if(!g.test($scope.goods.stock)) {
                alertService.addErrorAlert(Trans.trans('commonjs-spkcts'));
                return;
            }
        }
        if($scope.goods.salesVolume){

            if(!g.test($scope.goods.salesVolume)) {
                alertService.addErrorAlert(Trans.trans('commonjs-spxlts'));
                return;
            }
        }
        
        if(!$scope.goods.summary){
            $scope.goods.summary = "";
        }
        
        var formData = new FormData();
        var file = document.getElementById("changeImg").files[0];
      	formData.append("file", file);
      	formData.append("name", $scope.goods.name);
      	formData.append("summary", $scope.goods.summary);
      	formData.append("stock", $scope.goods.stock);
      	formData.append("supplier", $scope.goods.supplier);
      	formData.append("salesVolume", $scope.goods.salesVolume);
      	formData.append("price", $scope.goods.price);
      	formData.append("priceDiscount", $scope.goods.priceDiscount);
      	formData.append("supermarketStoreId", $scope.supermarketStoreId);
      	formData.append("type", $scope.type);
        formData.append("brandId", $scope.brand);
      	
      	if(!file){
        	alertService.addErrorAlert(Trans.trans('commonjs-sptpts'));
        	return;
      	}
      	$http.post(App.config.urlRoot + '/goods/addOrUpdate',formData, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
        }).success(function () {
            //关闭窗口
            $uibModalInstance.close($scope.supermarketStoreId);
            alertService.addSuccessAlert(Trans.trans('commonjs-xzyhts'));
        });
    };
    
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);


App.controller('EditGoodsCtrl',  ['$scope','$uibModalInstance','alertService', '$http','items','GoodsService','SuperMarketService','StoreService','GoodsCategoryService','MarketId','BrandService','Trans',function ($scope,$uibModalInstance,alertService,$http,items,GoodsService,SuperMarketService,StoreService,GoodsCategoryService,MarketId,BrandService,Trans) {
	
	//设置初始值
    $scope.goods = items;
    
    //切换超市下拉框列表
    $scope.changeSuperMarket = function () {
    	
    	if(!$scope.supermarketId){
            alertService.addErrorAlert(Trans.trans('commonjs-xzsscs'));
            return;
        }
        
        // 所属门店列表
    	StoreService.getStoreList({supermarketId: $scope.supermarketId},function(data) {
	        $scope.supermarketstore = data; 
    	});
		    	
    };
    
    
    //根据商品类型加载品牌
    $scope.changeGoodType=function() {
        if ($scope.type) {
        	// 所属品牌
            BrandService.getTypeList({typeId: $scope.type}, function (data) {
                $scope.brands = data;
            });
      	} else {
      		$scope.brands = null;
      	}
    };
    
	$scope.getInit = function () {
		
		// 所属超市列表
		SuperMarketService.getSuperMarketList(function(data) {
	        $scope.supermarket = data;
	        if(data.length >= 1){
	        	$scope.supermarketId = MarketId;
	        	
	        	// 所属门店列表
	        	StoreService.getStoreList({supermarketId: $scope.supermarketId},function(data) {
			        $scope.supermarketstore = data;
			        if(data.length >= 1){
			        	$scope.supermarketStoreId =  $scope.goods.supermarketStoreId;
			        }
			        
		    	});
	        }
	        
    	});
    	
    	// 商品2级类型列表
    	GoodsCategoryService.getAllProductList(function(data) {
	        $scope.goodstype = data;
	        if(data.length >= 1){
	        	$scope.type =  $scope.goods.type;
	        	
	        	BrandService.getTypeList({typeId: $scope.type}, function (data) {
                	$scope.brands = data;
                	if(data.length >= 1){
	        			$scope.brand =  $scope.goods.brandId;
	       	 		}
            	});
	        }
	        
    	});
    	
//  	GoodsCategoryService.getBrandList(function(data) {
//	        $scope.brands = data;
//	        if(data.length >= 1){
//	        	$scope.brand =  $scope.goods.brandId;
//	        }
//	        
//  	});
    	
    };
    
   	//修改门店
    $scope.save = function () {
        if(!$scope.goods){
            alertService.addErrorAlert(Trans.trans('commonjs-spxxts'));
            return;
        }
        if(!$scope.supermarketId){
            alertService.addErrorAlert(Trans.trans('commonjs-xzsscs'));
            return;
        }
        if(!$scope.supermarketStoreId){
            alertService.addErrorAlert(Trans.trans('commonjs-xzssmd'));
            return;
        }
        if(!$scope.goods.name){
            alertService.addErrorAlert(Trans.trans('commonjs-spmcts'));
            return;
        }
        
        if(!$scope.type){
            alertService.addErrorAlert(Trans.trans('commonjs-splxts'));
            return;
        }
        if(!$scope.brand){
            alertService.addErrorAlert(Trans.trans('commonjs-spppmc'));
            return;
        }
        
        if(!$scope.goods.summary){
            $scope.goods.summary = "";
        }
        
        var g=/^-?\d+$/;
        
        var g2=/^\d+(\.\d{0,2})?$/;
        if($scope.goods.price){
            if(!g2.test($scope.goods.price)) {
                alertService.addErrorAlert(Trans.trans('commonjs-spjgts'));
                return;
            }
        }
        if($scope.goods.priceDiscount){
            if(!g2.test($scope.goods.priceDiscount)) {
                alertService.addErrorAlert(Trans.trans('commonjs-spyhjgts'));
                return;
            }
        }
        if($scope.goods.stock){
            if(!g.test($scope.goods.stock)) {
                alertService.addErrorAlert(Trans.trans('commonjs-spkcts'));
                return;
            }
        }
        if($scope.goods.salesVolume){
            if(!g.test($scope.goods.salesVolume)) {
                alertService.addErrorAlert(Trans.trans('commonjs-spxlts'));
                return;
            }
        }
        
        var formData = new FormData();
        var file = document.getElementById("changeImg").files[0];
      	formData.append("file", file);
      	formData.append("id", $scope.goods.id);
      	formData.append("name", $scope.goods.name);
      	formData.append("summary", $scope.goods.summary);
      	formData.append("stock", $scope.goods.stock);
      	formData.append("supplier", $scope.goods.supplier);
      	formData.append("salesVolume", $scope.goods.salesVolume);
      	formData.append("price", $scope.goods.price);
      	formData.append("priceDiscount", $scope.goods.priceDiscount);
      	formData.append("supermarketStoreId", $scope.supermarketStoreId);
      	formData.append("type", $scope.type);
      	formData.append("brandId", $scope.brand);
      	
      	$http.post(App.config.urlRoot + '/goods/addOrUpdate',formData, {
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