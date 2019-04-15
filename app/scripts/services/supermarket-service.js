'use strict';
App.factory('SuperMarketService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot + '/supermarket/:id', {id: '@id'}, {
        'querySuperMarketById': {method: 'GET', isArray: false, url: App.config.urlRoot + '/supermarket/query/:id'},
        'querySuperMarketList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/supermarket/list'},
        'getSuperMarketList': {method: 'GET', isArray: true, url: App.config.urlRoot + '/supermarket/superMarketlist'}
        
    });
}]);
