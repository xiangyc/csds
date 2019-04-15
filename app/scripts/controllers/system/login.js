'use strict';
App.controller('LoginCtrl', ['$scope', '$rootScope', 'Login','Trans',function($scope, $rootScope, Login,Trans){

    $scope.addDefultCssAndCaptcha = function () {

        //初始化图形验证码
        $scope.changeCaptchaUrl();

        // 默认密码，代码可删除
        //$scope.user.username = "admin";
        //$scope.user.password = "jszadmin";
    };

    $scope.user = {};
    
    $scope.lang = window.localStorage.lang;
	if(!$scope.lang){
		$scope.lang = "en";
	}

    $scope.changeCaptchaUrl = function() {
        $scope.captchaUrl = App.config.urlRoot +  '/staff/captcha?_'+ new Date().getTime();
    };

    $scope.login = function($event) {
        if ($event && $event.type == 'keypress' && $event.keyCode != 13) {
            return false;
        }
        $scope.errorMessage = '';

        if (!$scope.user.username) {
            $scope.errorMessage = Trans.trans('commonjs-yhmts');
            return;
        }
        if (!$scope.user.password) {
            $scope.errorMessage = Trans.trans('commonjs-mmts');
            return;
        }
      if (!$scope.user.captcha) {
          $scope.errorMessage = Trans.trans('commonjs-yzmts');
          return;
      }
        Login.login($scope.user, function(data) {
			if(data.success){
				//window.location="/";
				Login.changeLang({lang:$scope.lang}, function () {
					window.location="/";
            	});
			} else {
				$scope.errorMessage = data.message;
			}

        }, function(data) {
            $scope.errorMessage = data.data.error;
            if ( $scope.errorMessage == Trans.trans('commonjs-yzmgqts') || $scope.errorMessage == Trans.trans('commonjs-yzmsxts')) {
                $scope.changeCaptchaUrl();
            }
        });
    };
}]);

App.controller('LogoutCtrl', ['$scope', 'Login', '$location', '$uibModal','alertService','$translate','Trans',function($scope, Login, $location,$uibModal,alertService,$translate,Trans) {
	
	$scope.lang = window.localStorage.lang;
	if(!$scope.lang){
		$scope.lang = "en";
	}
	
    Login.getStaff(function(data) {
        if(data.id){
            $scope.username = data.loginName;
            $scope.userId = data.id;
        } else {
            $location.path('/login');
        }
    });

    $scope.logout = function(userId) {
        if (userId) {
        	//$scope.switching('en');
            // 退出
            Login.logout(function() {
                $location.path('/login'); 
            }, function(data) {
                console.log(data.data.error);
            });
        }
    };

    $scope.changePwd = function() {
        $scope.pwd = {};
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/system/change-password.html',
            controller: 'system.changePasswordCtrl',
            backdrop: "static",
            size: 'md'
        });
        uibModalInstance.result.then(function () {
            alertService.addSuccessAlert(Trans.trans('login-107'));
        });
        
    };
    
    // 切换中英文
    $scope.switching = function(lang){  
        $translate.use(lang);  
        
        Login.changeLang({lang:lang}, function (data) {
        	console.log("切换成功");
    	}); 
    	
        window.localStorage.lang = lang;  
        window.location.reload();
    };  
    //scope.cur_lang = $translate.use();  
    

}]);

App.controller('system.changePasswordCtrl',  ['$scope','$uibModalInstance','StaffService','alertService','Trans',function ($scope,$uibModalInstance,StaffService,alertService,Trans) {
    $scope.submit = function () {

        if(!$scope.pwd){
            alertService.addErrorAlert(Trans.trans('commonjs-mmxxts'));
            return;
        }
        if(!$scope.pwd.orginPassword){
            alertService.addErrorAlert(Trans.trans('commonjs-ymmbnwkts'));
            return;
        }
        if(!$scope.pwd.newPassword){
            alertService.addErrorAlert(Trans.trans('commonjs-xmmbnwkts'));
            return;
        }
        StaffService.changePwd($scope.pwd, function () {
            $uibModalInstance.close();
        });
    };
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);