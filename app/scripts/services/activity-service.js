'use strict';
App.factory('ActivityService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot + '/activity/:id', {id: '@id'}, {
        'queryActivityById': {method: 'GET', isArray: false, url: App.config.urlRoot + '/activity/query/:id'},
        'queryActivityList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/activity/list'},
        'getStoreList': {method: 'GET', isArray: true, url: App.config.urlRoot + '/supermarketstore/superMarketStorelist'},
        'changeStatus': {method: 'PUT', isArray: false, url: App.config.urlRoot + '/activity/changeStatus'}
    });
}]);
