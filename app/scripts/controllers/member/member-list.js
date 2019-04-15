'use strict';
App.controller('MemberListCtrl', ['$scope','VdmUtil','$filter','$uibModal','alertService','MemberService','$confirm','Trans',function ($scope,VdmUtil,$filter,$uibModal,alertService,MemberService,$confirm,Trans) {
	
	//select中默认显示数
    $scope.viewby = '10';
   //当前页数，默认是第1页
    $scope.currentPage = 1;
    //每页显示记录条数
    $scope.itemsPerPage = $scope.viewby;
    
    $scope.member = {};
    
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
        MemberService.queryMemberList(params, function (data) {
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
    
    $scope.enableMember = function (id) {
    	
    	$confirm({title: Trans.trans('commonjs-warning'), text: Trans.trans('commonjs-qrqyyhts'),ok:Trans.trans('commonjs-ok'),cancel: Trans.trans('common-cancel')},{size: 'sm'}).then(function () {
            MemberService.enableMember({id: id}, function () {
                $scope.query();
                alertService.addSuccessAlert(Trans.trans('commonjs-qyhyts'));
            });
        });
    };

    $scope.forbidMember = function (id) {
    	
    	$confirm({title: Trans.trans('commonjs-warning'), text: Trans.trans('commonjs-qrjyyhts'),ok:Trans.trans('commonjs-ok'),cancel: Trans.trans('common-cancel')},{size: 'sm'}).then(function () {
            MemberService.forbidMember({id: id}, function () {
                $scope.query();
                alertService.addSuccessAlert(Trans.trans('commonjs-jyyhcgts'));
            });
        });
    
    };
    
    $scope.showMemberDetail = function (id) {
    	$scope.member =  MemberService.queryMemberDetailById({id: id},function() {
            $scope.showMemberDetailForm('max');
        }); 

    };
    
    $scope.showMemberDetailForm = function (size) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/member/member-detail.html',
            controller: 'MemberDetailCtrl',
            backdrop: "static",
            resolve: {
                items: function () {
                    return $scope.member;
                }
            },
            size: size
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };

    //申请提现
    $scope.showWithdrawApply = function (id) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/member/member-withdraw-apply.html',
            controller: 'WithdrawApplyCtrl',
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

App.controller('MemberDetailCtrl', ['$scope','$confirm','$uibModalInstance','alertService','items','MemberIntegralService','MemberCardService',
'BankCardService','CreditCardService','OrderRecordService','WithdrawApplyService',
function ($scope,$confirm,$uibModalInstance,alertService,items,MemberIntegralService,MemberCardService,BankCardService,CreditCardService,OrderRecordService,WithdrawApplyService) {
    
    //设置初始值
    $scope.member = items;
    
    //select中默认显示数
    $scope.viewby = '5';
   	//当前页数，默认是第1页
    $scope.currentPage = 1;
    //每页显示记录条数
    $scope.itemsPerPage = 5;
	
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
	
	$scope.getPage = function () {
        $scope.showMemberIntegral();
    };
    
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
    $scope.showMemberIntegral = function () {

        //查询参数
        var params = {
        	memberId: $scope.member.id,
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        MemberIntegralService.queryMemberIntegralList(params, function (data) {
            $scope.totalItems = data.totalItems;
            $scope.data = data.items;
        });
	    
	    // 下一页
	    $scope.pageChanged = function () {
	        $scope.showMemberIntegral();
	    };
	
	 };
    
    
    $scope.showMemberCard = function () {

        //查询参数
        var params = {
        	memberId: $scope.member.id,
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        MemberCardService.queryMemberCardList(params, function (data) {
            $scope.totalItems = data.totalItems;
            $scope.data = data.items;
        });
	    
	    // 下一页
	    $scope.pageChanged = function () {
	        $scope.showMemberCard();
	    };
	
	 };
	 
	 
	 $scope.showBankCard = function () {

        //查询参数
        var params = {
        	memberId: $scope.member.id,
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        BankCardService.queryBankCardList(params, function (data) {
            $scope.totalItems = data.totalItems;
            $scope.data = data.items;
        });
	    
	    // 下一页
	    $scope.pageChanged = function () {
	        $scope.showBankCard();
	    };
	
	 };
	 
	 
	 $scope.showCreditCard = function () {
	 
        //查询参数
        var params = {
        	memberId: $scope.member.id,
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        CreditCardService.queryCreditCardList(params, function (data) {
            $scope.totalItems = data.totalItems;
            $scope.data = data.items;
        });
	    
	    // 下一页
	    $scope.pageChanged = function () {
	        $scope.showCreditCard();
	    };
	
	 };
	 
	 
	 $scope.showOrderRecord = function () {

        //查询参数
        var params = {
        	memberId: $scope.member.id,
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        OrderRecordService.queryOrderRecordList(params, function (data) {
            $scope.totalItems = data.totalItems;
            $scope.data = data.items;
        });
	    
	    // 下一页
	    $scope.pageChanged = function () {
	        $scope.showOrderRecord();
	    };
	
	 };
	 
	 
	 $scope.showWithdrawApply = function () {
	 
        //查询参数
        var params = {
        	memberId: $scope.member.id,
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        WithdrawApplyService.queryWithdrawApplyList(params, function (data) {
            $scope.totalItems = data.totalItems;
            $scope.data = data.items;
        });
	    
	    // 下一页
	    $scope.pageChanged = function () {
	        $scope.showWithdrawApply();
	    };
	
	 };

}]);

App.controller('WithdrawApplyCtrl', ['$scope','$confirm','$uibModalInstance','alertService','MemberService','data','WithdrawApplyService','Trans',
    function ($scope,$confirm,$uibModalInstance,alertService,MemberService,data,WithdrawApplyService,Trans) {
        $scope.id = data;
        $scope.auditPass = function () {
            if(!$scope.accountNo){
                alertService.addErrorAlert(Trans.trans('commonjs-txzhts'));
                return;
            }
            if(!$scope.money){
                alertService.addErrorAlert(Trans.trans('commonjs-txjets'));
                return;
            }
            WithdrawApplyService.applyWithdraw({id: $scope.id,accountNo:$scope.accountNo,money:$scope.money}, function () {
                $uibModalInstance.close();
                alertService.addSuccessAlert(Trans.trans('commonjs-xzyhts'));
         });

        };

        $scope.onCancelClick = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }]);