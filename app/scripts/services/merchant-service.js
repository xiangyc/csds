'use strict';
App.factory('MerchantService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot + '/merchant/:id', {id: '@id'}, {
        'getMerchant': {method: 'GET', isArray: false, url: App.config.urlRoot + '/merchant/getMerchant'},
        'queryMerchantList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/merchant/list'},
        'checkPass': {method: 'PUT', isArray: false, url: App.config.urlRoot + '/merchant/checkPass/:id'},
        'save': {method: 'POST', isArray: false, url: App.config.urlRoot + '/merchant/save'},
        'queryMerchantDetail': {method: 'GET', isArray: false, url: App.config.urlRoot + '/merchant/query/:id'},
        'applyMerchantLog': {method: 'GET', isArray: false, url: App.config.urlRoot + '/merchant/applymerchantlog'},
        'getProvince': {method: 'GET', isArray: true, url: App.config.urlRoot + '/province/list'},
        'getCityList': {method: 'GET', isArray: true, url: App.config.urlRoot + '/province/regions'}
    });
}]);
