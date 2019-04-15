'use strict';
App.factory('StoreService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot + '/supermarketstore/:id', {id: '@id'}, {
        'querySuperMarketStoreById': {method: 'GET', isArray: false, url: App.config.urlRoot + '/supermarketstore/query/:id'},
        'querySuperMarketStoreList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/supermarketstore/list'},
        'getStoreList': {method: 'GET', isArray: true, url: App.config.urlRoot + '/supermarketstore/superMarketStorelist'},
        'getAllStoreList': {method: 'GET', isArray: true, url: App.config.urlRoot + '/supermarketstore/allStorelist'},
        'changeStatus': {method: 'PUT', isArray: false, url: App.config.urlRoot + '/supermarketstore/changeStatus'}
        
    });
}]);
