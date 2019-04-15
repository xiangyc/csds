'use strict';
App.controller('RoleListCtrl', ['$scope','RoleService','$uibModal','$confirm','alertService','UI','Trans',function ($scope,RoleService,$uibModal,$confirm,alertService,UI,Trans) {

	//select中默认显示数
    $scope.viewby = '10';
   //当前页数，默认是第1页
    $scope.currentPage = 1;
    //每页显示记录条数
    $scope.itemsPerPage = $scope.viewby;
    //角色
    $scope.role = {};
	
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
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };
        RoleService.queryRoleList(params, function (data) {
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
    
    //添加角色
    $scope.addRole = function () {
        $scope.showCreateForm('md');
    };

  	//创建窗口
    $scope.showCreateForm = function (size) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/user/add-role.html',
            controller: 'AddRoleCtrl',
            backdrop: "static",
            size: size
        });
        uibModalInstance.result.then(function () {
        	$scope.getPage();
        });
    };
    
    //修改角色
    $scope.editRole = function (id) {
    	$scope.role =  RoleService.queryRoleById({id: id},function() {
            $scope.showEditForm('md');
        });
    };

  	//创建窗口
    $scope.showEditForm = function (size) {
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/user/edit-role.html',
            controller: 'EditRoleCtrl',
            backdrop: "static",
            resolve: {
                items: function () {
                    return $scope.role;
                }
            },
            size: size
        });
        uibModalInstance.result.then(function () {
        	$scope.getPage();
        });
    };

    //删除角色
    $scope.deleteRole = function (id) {
    	
    	$confirm({title: Trans.trans('commonjs-warning'), text: Trans.trans('commonjs-qdscgjlts'), ok: Trans.trans('commonjs-ok'), cancel: Trans.trans('common-cancel')},{size: 'sm'}).then(function (){
            RoleService.queryRolestaff({id: id}, function (data) {
               if (data !== null && data.length > 0){
                   UI.alert({title:Trans.trans('commonjs-warning'),message:Trans.trans('commonjs-jsyyscts')});
               }else {
                   RoleService.deleteRole({id: id },function() {
                       $scope.getPage();
                       alertService.addSuccessAlert(Trans.trans('commonjs-sccgts'));
                   });
               }
            });
        });
    
    };
    
    //分配用户
    $scope.grantStaff = function(role) {
       var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/user/edit-staff-role.html',
            controller: 'StaffRoleCtrl',
            backdrop: "static",
            resolve: {
                items: function () {
                    return role;
                }
            },
            size: 'md'
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };
    
    //分配权限
    $scope.grantPermission = function(role){
        var uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/user/role-permission-grant.html',
            controller: 'PermissionGrantCtrl',
            backdrop: "static",
            resolve: {
                items: function () {
                    return role;
                }
            },
            size: 'md'
        });
        uibModalInstance.result.then(function () {
            $scope.getPage();
        });
    };

}]);

//新建角色
App.controller('AddRoleCtrl',  ['$scope','$uibModalInstance','alertService','RoleService','Trans',function ($scope,$uibModalInstance,alertService,RoleService,Trans) {

    $scope.save = function () {
    	if(!$scope.role){
            alertService.addErrorAlert(Trans.trans('commonjs-jsxxts'));
            return;
        }
        if(!$scope.role.name){
            alertService.addErrorAlert(Trans.trans('commonjs-jsmcts'));
            return;
        }
        if(!$scope.role.note){
            alertService.addErrorAlert(Trans.trans('commonjs-jssmts'));
            return;
        }
        
        //添加
        RoleService.addOrUpdateRole({ name: $scope.role.name, note: $scope.role.note  },function() {
        	$uibModalInstance.close();
            alertService.addSuccessAlert(Trans.trans('commonjs-xzyhts'));
        });
        
    };
    
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
}]);

//编辑角色
App.controller('EditRoleCtrl',  ['$scope','$uibModalInstance','items','alertService','RoleService','Trans',function ($scope,$uibModalInstance,items,alertService,RoleService,Trans) {
	//设置初始值
    $scope.role = items;
    $scope.save = function () {
    	if(!$scope.role){
            alertService.addErrorAlert(Trans.trans('commonjs-jsxxts'));
            return;
        }
        if(!$scope.role.name){
            alertService.addErrorAlert(Trans.trans('commonjs-jsmcts'));
            return;
        }
        if(!$scope.role.note){
            alertService.addErrorAlert(Trans.trans('commonjs-jssmts'));
            return;
        }
        
        //修改
        RoleService.addOrUpdateRole({ id: $scope.role.id, name: $scope.role.name, note: $scope.role.note  },function() {
        	$uibModalInstance.close();
            alertService.addSuccessAlert(Trans.trans('commonjs-xgcgts'));
        });
    };
    
    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
}]);


//角色用户设置
App.controller('StaffRoleCtrl',  ['$scope','$uibModalInstance','StaffService','RoleService','items','UI','alertService','Trans',function ($scope,$uibModalInstance,StaffService,RoleService,items,UI,alertService,Trans) {
    $scope.role = items;

    //设置初始值
    //select中默认显示数
    $scope.viewby = '10';
    //当前页数，默认是第1页
    $scope.currentPage = 1;
    //每页显示记录条数
    $scope.itemsPerPage = $scope.viewby;
    //翻页时，页面上显示的最大页数，
    $scope.maxSize = 10;
    $scope.totalItems = 0;
    $scope.staff = [];
    $scope.isQueryStaff = true;
    $scope.checkItem = [];

    //分页
    $scope.getPage = function() {
        //查询参数
        var params = {
            start: ( $scope.currentPage - 1),
            maxResults: $scope.itemsPerPage
        };

        StaffService.queryStaffList(params,function (data) {
            $scope.totalItems = data.totalItems;
            $scope.data = data.items;

            if($scope.isQueryStaff){
                RoleService.queryRolestaff({id: $scope.role.id}, function(data){
                    if(data){
                        $scope.staff = data;
                        angular.forEach($scope.staff, function(data){
                            $scope.checkItem.push(data.staff.id);
                        });

                        $scope.setSelect();
                        $scope.isQueryStaff = false;
                    }
                });
            }else{
                RoleService.queryRolestaff({id: $scope.role.id}, function(){
                    $scope.setSelect();
                });
            }
        });
    };

    $scope.pageChanged = function () {
        $scope.getPage();
    };

    //切换pageSize
    $scope.setItemsPerPage = function (num) {
        $scope.itemsPerPage = num;
        $scope.currentPage = 1; //reset to first paghe
        $scope.getPage();
    };

    //选择已选项
    $scope.setSelect = function(){
        var chkArray = document.getElementsByName("userChk");

        angular.forEach($scope.checkItem, function(data){
            for (var i = 0; i < chkArray.length; i++) {
                if(data == chkArray[i].value){
                    chkArray[i].checked = true;
                }
            }
        });
    };

    //选择员工
    $scope.selectSatff = function(id, item){
        if(item.target.checked) {
            var existsId = false;
            angular.forEach($scope.checkItem, function(data){
                if(data == id){
                    existsId = true;
                }
            });

            if(!existsId) {
                $scope.checkItem.push(id);
            }
        }else{
            for(var i = 0; i < $scope.checkItem.length; i++) {
                if($scope.checkItem[i] == id) {
                    $scope.checkItem.splice(i, 1);
                }
            }
        }
    };

    //全选、全消
    $scope.selectAll = function() {
        var chkAll = document.getElementById("chkAll");
        var chkArray = document.getElementsByName("userChk");

        if (chkAll.checked) {
            for (var i = 0; i < chkArray.length; i++) {
                chkArray[i].checked = true;
            }
        } else {
            for (var j = 0; j < chkArray.length; j++) {
                chkArray[j].checked = false;
            }
        }
    };

    //父控制器中监听事件
    $scope.$on('repeatFinishEvent',function(){
        $scope.setSelect();
    });

    //保存
    $scope.onSaveEdit = function () {
        var ids = "0|";

        for (var i = 0; i <  $scope.checkItem.length; i++) {
            ids += $scope.checkItem[i] + "|";
        }

        if(ids.length > 0){
            ids = ids.substring(0,ids.length - 1);
        }

        RoleService.saveRoleStaff({id: $scope.role.id, staffIds: ids}, function(data){
            if(data){
                alertService.addSuccessAlert(Trans.trans('commonjs-fpyhts'));
                $uibModalInstance.close();
            }
        });
    };

    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);

//角色权限设置
App.controller('PermissionGrantCtrl',  ['$scope','$uibModalInstance','Permission','RoleService','ivhTreeviewBfs','ivhTreeviewMgr','items','alertService','Trans',function ($scope,$uibModalInstance,Permission,RoleService,ivhTreeviewBfs,ivhTreeviewMgr,items,alertService,Trans) {
    //设置初始值
    $scope.role = items;
    $scope.menu = [];
    $scope.rolePermission = [];
    $scope.selectedItems = [];

    function selectMenu(menus, selectedIds) {
        angular.forEach(menus, function(menu) {
            if (menu.children && menu.children.length > 0) {
                selectMenu(menu.children, selectedIds);
            } else {
                angular.forEach(selectedIds, function (id) {
                    if (menu.id == id) {
                        $scope.selectedItems.push(id);
                        return;
                    }
                });
            }
        });

    }

    Permission.allpermission(function(data){
        if(data){
          $scope.menu = data;
            Permission.rolepermission({id: $scope.role.id}, function(data){
                if(data){
                    angular.forEach(data, function(item){
                        $scope.rolePermission.push(item.id);
                    });
                    selectMenu($scope.menu, $scope.rolePermission);
                    $scope.setSelect();
                }
            });
        }
    });

    //选择已选项
    $scope.setSelect = function(){
       ivhTreeviewMgr.selectEach($scope.menu, $scope.selectedItems);
    };

    //全选
    $scope.onSelectAll = function(){
        ivhTreeviewMgr.selectAll($scope.menu);
    };

    //全消
    $scope.onUnSelectAll = function(){
        ivhTreeviewMgr.deselectAll($scope.menu);
    };

    //保存
    $scope.onSaveEdit = function () {
        var ids = "0|";

        ivhTreeviewBfs($scope.menu, function(node) {
            if (node.selected){
                ids += node.id + "|";
            }

        });

        if(ids.length > 0){
            ids = ids.substring(0,ids.length - 1);
        }

        RoleService.addpermission({id: $scope.role.id, permissionIds: ids}, function(data){
            if(data){
                alertService.addSuccessAlert(Trans.trans('commonjs-jsqxszts'));
                $uibModalInstance.close();
            }
        });

        $uibModalInstance.close();
    };

    $scope.onCancelClick = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
