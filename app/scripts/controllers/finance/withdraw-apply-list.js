'use strict';
App.controller('WithdrawApplyListCtrl', ['$scope','VdmUtil','$filter','$uibModal','alertService','WithdrawApplyService','Trans',function ($scope,VdmUtil,$filter,$uibModal,alertService,WithdrawApplyService,Trans) {
	
	//select中默认显示数
    $scope.viewby = '10';
   //当前页数，默认是第1页
    $scope.currentPage = 1;
    //每页显示记录条数
    $scope.itemsPerPage = $scope.viewby;
    
    $scope.apply = {};
	
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
    
    	//校验日期
        if ($scope.startDate > $scope.endDate) {
             alertService.addErrorAlert(Trans.trans('commonjs-sjts'));
             return;
        }
        
        //查询参数
        var params = {
            mobile:$scope.mobile,
            status:$scope.status,
        	startDate: $filter('date')($scope.startDate, 'yyyy-MM-dd'),
            endDate: $filter('date')($scope.endDate, 'yyyy-MM-dd'),
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        WithdrawApplyService.queryWithdrawApplyList(params, function (data) {
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

    $scope.showWithdrawAudit = function (id) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/finance/withdraw-apply-audit.html',
            controller: 'WithdrawAuditCtrl',
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
}]);


App.controller('WithdrawAuditCtrl', ['$scope','$confirm','$uibModalInstance','alertService','WithdrawApplyService','data','Trans',
    function ($scope,$confirm,$uibModalInstance,alertService,WithdrawApplyService,data,Trans) {
        $scope.id = data;
        $scope.auditPass = function () {
            WithdrawApplyService.withdrawPass({id: $scope.id}, function () {
                $uibModalInstance.close();
                alertService.addSuccessAlert(Trans.trans('commonjs-ycltjts'));
            });
        };

        $scope.auditNotPass = function () {
            if(!$scope.auditNote){
                alertService.addErrorAlert(Trans.trans('commonjs-txyyts'));
                return;
            } else {
                WithdrawApplyService.withdrawNotPass({id: $scope.id,auditNote:$scope.auditNote}, function () {
                    $uibModalInstance.close();
                    alertService.addSuccessAlert(Trans.trans('commonjs-bcltjts'));
                });
            }
        };

        $scope.onCancelClick = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }]);

