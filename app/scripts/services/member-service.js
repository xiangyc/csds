'use strict';
App.factory('MemberService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot + '/member/:id', {id: '@id'}, {
        'queryMemberList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/member/list'},
        'queryMemberDetailById': {method: 'GET', isArray: false, url: App.config.urlRoot + '/member/query/:id'},
        'forbidMember': {method: 'PUT', isArray: false, url: App.config.urlRoot + '/member/forbid/:id'},
        'enableMember': {method: 'PUT', isArray: false, url: App.config.urlRoot + '/member/enable/:id'},
        'saveRoleStaff':{method: 'POST', isArray: false, url: App.config.urlRoot + '/role/add'},
        'addpermission': {method: 'POST', isArray: false, url: App.config.urlRoot + '/role/addpermission'},
        'applyWithdraw': {method: 'PUT', isArray: false, url: App.config.urlRoot + '/order/applywithdraw'},
    });
}]);
