/**
 * xiangyc
 */
'use strict';
App.controller('FeedbackListCtrl', ['$scope','$uibModal','$filter','$confirm','alertService','FeedbackService','Trans',function($scope,$uibModal,$filter,$confirm,alertService,FeedbackService,Trans) {

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
        //校验日期
        if ($scope.startDate > $scope.endDate) {
            alertService.addErrorAlert(Trans.trans('commonjs-sjts'));
            return;
        }
        //查询参数
        var params = {
            mobile:$scope.mobile,
            startDate: $filter('date')($scope.startDate, 'yyyy-MM-dd'),
            endDate: $filter('date')($scope.endDate, 'yyyy-MM-dd'),
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        FeedbackService.queryFeedbackList(params, function (data) {
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
        $scope.endDate = null;
        $scope.startDate = null;
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


	$scope.openFeedbackApplyWin = function (id) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/operation/feedback-apply-audit.html',
            controller: 'AuditFeedbackCtrl',
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

App.controller('AuditFeedbackCtrl', ['$scope','$confirm','$uibModalInstance','alertService','FeedbackService','data','Trans',
    function ($scope,$confirm,$uibModalInstance,alertService,FeedbackService,data,Trans) {

        $scope.applyId = data;
        $scope.auditPass = function () {
            if(!$scope.auditNote){
                alertService.addErrorAlert(Trans.trans('commonjs-txclyjts'));
                return;
            } else {
                    FeedbackService.changeStatus({id: $scope.applyId,status:1,note:$scope.auditNote}, function () {
                        $uibModalInstance.close();
                        alertService.addSuccessAlert(Trans.trans('commonjs-ycltjts'));
                    });
            }
        };

        $scope.auditNotPass = function () {
            if(!$scope.auditNote){
                alertService.addErrorAlert(Trans.trans('commonjs-txclyjts'));
                return;
            } else {
                FeedbackService.changeStatus({id: $scope.applyId,status:2,note:$scope.auditNote}, function () {
                    $uibModalInstance.close();
                    alertService.addSuccessAlert(Trans.trans('commonjs-bcltjts'));
                });

            }
        };

        $scope.onCancelClick = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }]);
