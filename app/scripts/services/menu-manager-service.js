'use strict';
App.factory('MenuManagerService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot + '/helps/:id', {}, {
        'addOrUpdate': {method: 'POST', isArray: false, url: App.config.urlRoot + '/permission/update/:id'},
        'queryMenuById': {method: 'GET', isArray: false, url: App.config.urlRoot + '/permission/query/:id'},
        'queryMenuList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/permission/list'},
        'deleteMenu': {method: 'POST', isArray: false, url: App.config.urlRoot + '/permission/delete'},
        'getMenuListByType': {method: 'GET', isArray: true, url: App.config.urlRoot + '/permission/parentMenulist'}
    });
}]);
