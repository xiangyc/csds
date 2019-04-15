'use strict';
App.factory('SystemLogService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot + '/AdminOpLog/:id', {}, {
        'addOrUpdate': {method: 'POST', isArray: false, url: App.config.urlRoot + '/adminOpLog/addOrUpdate/:id'},
        'querySystemLogById': {method: 'GET', isArray: false, url: App.config.urlRoot + '/adminOpLog/query/:id'},
        'querySystemLogList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/adminOpLog/list'},
        'deleteSystemLog': {method: 'POST', isArray: false, url: App.config.urlRoot + '/adminOpLog/delete'}
    });
}]);
