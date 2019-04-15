'use strict';
App.factory('AppVersionService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot + '/appVersion/:id', {}, {
        'addOrUpdate': {method: 'POST', isArray: false, url: App.config.urlRoot + '/appVersion/addOrUpdate/:id'},
        'queryAppVersionById': {method: 'GET', isArray: false, url: App.config.urlRoot + '/appVersion/query/:id'},
        'queryAppVersionList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/appVersion/list'},
        'deleteAppVersion': {method: 'POST', isArray: false, url: App.config.urlRoot + '/appVersion/delete'}
    });
}]);
