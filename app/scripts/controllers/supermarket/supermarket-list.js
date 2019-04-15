'use strict';
App.controller('SuperMarketListCtrl', ['$scope','$uibModal','alertService','$confirm','SuperMarketService','$filter','Trans',function ($scope,$uibModal,alertService,$confirm,SuperMarketService,$filter,Trans) {
	
	//select中默认显示数
    $scope.viewby = '10';
   //当前页数，默认是第1页
    $scope.currentPage = 1;
    //每页显示记录条数
    $scope.itemsPerPage = $scope.viewby;
    //超市
    $scope.supermarket = {};
	
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
        	startDate: $filter('date')($scope.startDate, 'yyyy-MM-dd'),
            endDate: $filter('date')($scope.endDate, 'yyyy-MM-dd'),
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        SuperMarketService.querySuperMarketList(params, function (data) {
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
        $scope.startDate = null;
        $scope.endDate = null;
    }; 
    

//  //添加超市
//  $scope.addSuperMarket = function () {
//      $scope.showCreateForm('md');
//  };
//  //添加超市弹出窗口
//  $scope.showCreateForm = function (size) {
//      var uibModalInstance = $uibModal.open({
//          animation: true,
//          templateUrl: 'views/supermarket/add-supermarket.html',
//          controller: 'AddSuperMarketCtrl',
//          backdrop: "static",
//          size: size
//      });
//      uibModalInstance.result.then(function () {
//      	$scope.getPage();
//      });
//  };
    
    //修改超市弹出窗口
    $scope.showEditForm = function (size) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/supermarket/edit-supermarket.html',
            controller: 'EditSuperMarketCtrl',
            backdrop: "static",
            resolve: {
                items: function () {
                    return $scope.supermarket;
                }
            },
            size:size
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };
    //删除超市绑定事件
    $scope.deleteSuperMarket = function () {
        $confirm({title: '确认', text: '确定删除该超市吗？',ok:'确认',cancel: '取消'},{size: 'sm'}).then(function () {
            alertService.addSuccessAlert('删除超市成功!');
        });
    };
    //修改超市
    $scope.editSuperMarket = function (id) {
    	$scope.supermarket =  SuperMarketService.querySuperMarketById({id: id},function() {
            $scope.showEditForm('md');
        }); 
    };
	
	//同步超时数据
	$scope.importMarketData = function () {
    	
    	$confirm({title: Trans.trans('commonjs-warning'), text: Trans.trans('commonjs-qrtbsjts'),ok:Trans.trans('commonjs-ok'),cancel: Trans.trans('common-cancel')},{size: 'sm'}).then(function () {
            alertService.addSuccessAlert(Trans.trans('commonjs-tbsjts'));
        });
    };
	
	$scope.showSuperMarketDetail = function (id) {
    	$scope.supermarket =  SuperMarketService.querySuperMarketById({id: id},function() {
            $scope.showDetailForm('md');
        }); 

    };
    
    $scope.showDetailForm = function (size) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/supermarket/supermarket-detail.html',
            controller: 'SupermarketDetailCtrl',
            backdrop: "static",
            resolve: {
                items: function () {
                    return $scope.supermarket;
                }
            },
            size: size
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });

    };
    
}]);
//添加超市控制器
//App.controller('AddSuperMarketCtrl',  ['$scope','$uibModalInstance','alertService','$http',function ($scope,$uibModalInstance,alertService,$http) {
//
//  $scope.save = function () {
//  	
//  	if(!$scope.supermarket){
//          alertService.addErrorAlert('超市信息不能为空');
//          return;
//      }
//      if(!$scope.supermarket.name){
//          alertService.addErrorAlert('超市名称不能为空');
//          return;
//      }
//      
//      var formData = new FormData();
//      var file = document.getElementById("changeImg").files[0];
//    	formData.append("file", file);
//    	formData.append("name", $scope.supermarket.name);
//    	formData.append("promotion", $scope.supermarket.promotion);
//    	formData.append("note", $scope.supermarket.note);
//    	if(!file){
//      	alertService.addErrorAlert('超市图标不能为空');
//      	return;
//    	}
//    	$http.post(App.config.urlRoot + '/supermarket/addOrUpdate',formData, {
//            transformRequest: angular.identity,
//            headers: {'Content-Type': undefined}
//      }).success(function () {
//          //关闭窗口
//          $uibModalInstance.close();
//          alertService.addSuccessAlert('新增超市成功');
//      });
//      
//  };
//  
//  $scope.onCancelClick = function () {
//      $uibModalInstance.dismiss('cancel');
//  };
//  
//}]);
//修改超市控制器
App.controller('EditSuperMarketCtrl',  ['$scope','$uibModalInstance','alertService','$http','items','Trans',function ($scope,$uibModalInstance,alertService,$http,items,Trans) {
	
	//设置初始值
    $scope.supermarket = items;
    //修改超市
    $scope.save = function () {
        if(!$scope.supermarket){
            alertService.addErrorAlert(Trans.trans('commonjs-csxxts'));
            return;
        }
        if(!$scope.supermarket.name){
            alertService.addErrorAlert(Trans.trans('commonjs-csmcts'));
            return;
        }
        if(!$scope.supermarket.summary){
            $scope.supermarket.summary = "";
        }
        
        var formData = new FormData();
        var file = document.getElementById("changeImg").files[0];
      	formData.append("file", file);
      	formData.append("id", $scope.supermarket.id);
      	formData.append("name", $scope.supermarket.name);
      	formData.append("promotion", $scope.supermarket.promotion);
      	formData.append("summary", $scope.supermarket.summary);

      	$http.post(App.config.urlRoot + '/supermarket/addOrUpdate',formData, {
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


App.controller('SupermarketDetailCtrl', ['$scope','items','SuperMarketService','$confirm','$uibModalInstance','alertService','StoreService',
    function ($scope,items, SuperMarketService,$confirm,$uibModalInstance,alertService,StoreService) {

    // 接收参数
    $scope.supermarket = items;


  	$scope.init = function () {
  		StoreService.getStoreList({supermarketId: $scope.supermarket.id}, function (data) { 
  			$scope.store = data;
  		});
  	};

    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);
