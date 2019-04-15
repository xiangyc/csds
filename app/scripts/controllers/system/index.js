'use strict';
App.controller('IndexCtrl', ['$scope','$location','Login', function($scope, $location,Login) {
    Login.getStaff(function(data) {
        if(data.id){
            $scope.username = data.loginName;
            $scope.userId = data.id;
        } else {
            $location.path('/login');
        }
    });

    $scope.init = function () {
		
    };


}]);
