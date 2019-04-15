'use strict';
App.factory('Permission', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot + '/permission/:id', {}, {
        'rolepermission': {method: 'GET', isArray: true, url: App.config.urlRoot + '/permission/rolepermission/:id'},
        'allpermission': {method: 'GET',  isArray: true, url: App.config.urlRoot + '/permission/allpermission'},
        'menu': {method: 'GET', isArray: true, url: App.config.urlRoot + '/permission/menu'}
    });
}]);

App.factory('RoleService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot + '/role/:id', {id: '@id'}, {
        'queryRoleList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/role/list'},
        'addOrUpdateRole': {method: 'POST', isArray: false, url: App.config.urlRoot + '/role/addOrUpdate'},
        'queryRolestaff': {method: 'GET', isArray: true, url: App.config.urlRoot + '/role/rolestaff/:id'},
        'queryRoleById': {method: 'GET', isArray: false, url: App.config.urlRoot + '/role/query/:id'},
        'deleteRole': {method: 'POST', isArray: false, url: App.config.urlRoot + '/role/delete'},
        'saveRoleStaff':{method: 'POST', isArray: false, url: App.config.urlRoot + '/role/add'},
        'addpermission': {method: 'POST', isArray: false, url: App.config.urlRoot + '/role/addpermission'}
        
    });
}]);
