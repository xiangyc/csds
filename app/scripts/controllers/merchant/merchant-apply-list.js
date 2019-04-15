'use strict';
App.controller('MerchantApplyListCtrl', ['$scope','$filter','alertService','$uibModal','$location','Login','MerchantService','$http','StaffService','$confirm','Trans',function ($scope,$filter,alertService,$uibModal,$location,Login,MerchantService,$http,StaffService,$confirm,Trans) {
	
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
    // 默认预申请状态
    //$scope.status = '0';

    //分页
    $scope.getPage = function() {
    
    	//校验日期
        if ($scope.startDate > $scope.endDate) {
             alertService.addErrorAlert(Trans.trans('commonjs-sjts'));
             return;
        }
        
        //查询参数
        var params = {
        	mobile:$scope.mobile,
        	status: $scope.status,
        	startDate: $filter('date')($scope.startDate, 'yyyy-MM-dd'),
            endDate: $filter('date')($scope.endDate, 'yyyy-MM-dd'),
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        MerchantService.queryMerchantList(params, function (data) {
            $scope.totalItems = data.totalItems;
            $scope.data = data.items;
        });
    };

    $scope.query  = function () {
        $scope.currentPage = 1;
        $scope.getPage();
    };
    
    $scope.reset = function() {
        $scope.mobile = null;
        $scope.status = null;
        $scope.startDate = null;
        $scope.endDate = null;
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
    
    
	// 获取初始账号数据
	$scope.getMerchant = function () {
		MerchantService.getMerchant(function(data) {
	        if(data.id){
	            $scope.user = data;
	        } else {
	            $location.path('/login');
	        }
    	});
    	
    	MerchantService.getProvince({lang:$scope.lang},function(data) {
	        $scope.provinceList = data;
    	});
    	
    };
    
    //根据省加载城市
    $scope.changeProvince=function() {
      if ($scope.provinceId) {
        // 所属城市列表
            MerchantService.getCityList({provinceId: $scope.provinceId}, function (data) {
                $scope.cityList = data;
            });
      } else {
      	$scope.cityList = null;
      }
    };
    
    // 商户申请审核
    $scope.openMerchantApplyWin = function (id,status) {
    
    	if(status == 1 || status == -1 || status == 0){
    		return;
    	}

        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/merchant/merchant-apply-audit.html',
            controller: 'MerchantApplyAuditCtrl',
            backdrop: "static",
            resolve: {
                data: function () {
                    return id;
                }
            },
            size: 'md'
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };
    
    // 创建商户账号
    $scope.addMerchantAccount = function () {

        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/merchant/add-merchant-account.html',
            controller: 'AddMerchantAccountCtrl',
            backdrop: "static",
            size: 'md'
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };
    
    $scope.save = function () {
    	
    	MerchantService.getMerchant(function(data) {
    	
	        if(data.status != null){
	        	if(data.status == 1){
					alertService.addSuccessAlert(Trans.trans('commonjs-cwzsshts'));
					return;
				} else if (data.status == 2) {
					alertService.addErrorAlert(Trans.trans('commonjs-sqrzshts'));
					return;
				} else {
				
					if(!$scope.merchant){
			            alertService.addErrorAlert(Trans.trans('commonjs-txrzts'));
			            return;
			        }
			        if(!$scope.merchant.name){
			        	$('#msg1').removeClass("hide");
			            return;
			        } else {
			        	$('#msg1').addClass("hide");
			        }
			        if(!$scope.merchant.socialCreditCode){
			        	$('#msg7').removeClass("hide");
			            return;
			        } else {
			        	$('#msg7').addClass("hide");
			        }
			        if(!$scope.merchant.type){
			        	$('#msg2').removeClass("hide");
			            return;
			        } else {
			        	$('#msg2').addClass("hide");
			        }
			        
			        if(!$scope.cityId){
			        	$('#msg10').removeClass("hide");
			            return;
			        } else {
			        	$('#msg10').addClass("hide");
			        }
			        
			        if(!$scope.merchant.registTime){
			        	alertService.addErrorAlert(Trans.trans('commonjs-txqyts'));
			            return;
			        }
			        if(!$scope.merchant.address){
			        	$('#msg3').removeClass("hide");
			            return;
			        } else {
			        	$('#msg3').addClass("hide");
			        }
			        
			        if(!$scope.merchant.linkMan){
			        	$('#msg4').removeClass("hide");
			            return;
			        } else {
			        	$('#msg4').addClass("hide");
			        }
			        
			        if(!$scope.merchant.linkTel){
			        	$('#msg5').removeClass("hide");
			            return;
			        } else {
			        	$('#msg5').addClass("hide");
			        }
			        
			        if(!$scope.merchant.promotion){
			        	$('#msg6').removeClass("hide");
			            return;
			        } else {
			        	$('#msg6').addClass("hide");
			        }
			        
			        var formData = new FormData();
			        var file = document.getElementById("changeImg").files[0];
			      	formData.append("file", file);
			      	formData.append("id", data.id);
			      	formData.append("name", $scope.merchant.name);
			      	formData.append("type", $scope.merchant.type);
			      	formData.append("cityId", $scope.cityId);
			      	formData.append("address", $scope.merchant.address);
			      	formData.append("linkTel", $scope.merchant.linkTel);
			      	formData.append("promotion", $scope.merchant.promotion);
			      	formData.append("linkMan", $scope.merchant.linkMan);
			      	formData.append("socialCreditCode", $scope.merchant.socialCreditCode);
			      	formData.append("registTime", $filter('date')($scope.merchant.registTime, 'yyyy-MM-dd'));
			      	
			      	if(!file){
			        	alertService.addErrorAlert(Trans.trans('commonjs-shtbts'));
			        	return;
			      	}
			      	$http.post(App.config.urlRoot + '/merchant/apply',formData, {
			              transformRequest: angular.identity,
			              headers: {'Content-Type': undefined}
			        }).success(function () {
			            alertService.addSuccessAlert(Trans.trans('commonjs-shrzxxts'));
			            $scope.merchant = {};
			            $scope.provinceId = null;
			            $scope.cityId = null;
			        });
			        
				}
	        }
    	});
    	
        
    };
    
    $scope.onCancelClick = function () {
    	$('.middle').addClass("hide");
    	$scope.merchant = {};
    };
    
    //审核详情
    $scope.showMerchantLog = function (merchantId) {
        $scope.showMerchantLogForm('max',merchantId);
    };

    $scope.showMerchantLogForm = function (size,merchantId) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/merchant/apply-merchant-log.html',
            controller: 'MerchantLogCtrl',
            backdrop: "static",
            resolve: {
                merchantId: function () {
                    return merchantId;
                }
            },
            size: size
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
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

App.controller('MerchantApplyAuditCtrl', ['$scope','$confirm','$uibModalInstance','alertService','MerchantService','data','Trans',
    function ($scope,$confirm,$uibModalInstance,alertService,MerchantService,data,Trans) {
	
	$scope.applyId = data;
    $scope.auditPass = function () {
        if($scope.auditNote){
            alertService.addErrorAlert(Trans.trans('commonjs-shtgyyts'));
            return;
        } else {
            $confirm({title: Trans.trans('commonjs-warning'), text: Trans.trans('commonjs-qrtgshsqts'), ok: Trans.trans('commonjs-ok'), cancel: Trans.trans('common-cancel')},{size: 'sm'}).then(function () {
                MerchantService.checkPass({id: $scope.applyId,status:1}, function () {
                    $uibModalInstance.close();
                    alertService.addSuccessAlert(Trans.trans('commonjs-shsqtgts'));
                });
            });
        }
    };

    $scope.auditNotPass = function () {

        if($scope.auditNote){
            $confirm({title: Trans.trans('commonjs-warning'), text: Trans.trans('commonjs-qrbtgsqts'), ok: Trans.trans('commonjs-ok'), cancel: Trans.trans('common-cancel')},{size: 'sm'}).then(function () {
            	MerchantService.checkPass({id: $scope.applyId,status:-1,auditNote:$scope.auditNote}, function () {
                    $uibModalInstance.close();
                    alertService.addSuccessAlert(Trans.trans('commonjs-shsqbtgts'));
                });
            });
        } else {
            alertService.addErrorAlert(Trans.trans('commonjs-shbtgyyts'));
            return;
        }
    };

    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);

//添加商户
App.controller('AddMerchantAccountCtrl',  ['$scope','$uibModalInstance','alertService','MerchantService','Trans',function ($scope,$uibModalInstance,alertService,MerchantService,Trans) {

    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    $scope.save = function () {
        if(!$scope.user){
            alertService.addErrorAlert(Trans.trans('commonjs-shxxts'));
            return;
        }
        if(!$scope.user.loginName){
            alertService.addErrorAlert(Trans.trans('commonjs-shzhts'));
            return;
        }
        if(!$scope.user.marketName){
            alertService.addErrorAlert(Trans.trans('commonjs-csmcts'));
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

        MerchantService.save($scope.user, function () {
        	$uibModalInstance.close();
            alertService.addSuccessAlert(Trans.trans('commonjs-cjshzhts'));
        });
    };
    
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
