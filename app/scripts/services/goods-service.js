'use strict';
App.factory('GoodsService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot + '/goods/:id', {id: '@id'}, {
        'queryGoodsById': {method: 'GET', isArray: false, url: App.config.urlRoot + '/goods/query/:id'},
        'queryGoodsList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/goods/list'},
        'changeStatus': {method: 'PUT', isArray: false, url: App.config.urlRoot + '/goods/changeStatus'},
        'getBrandList': {method: 'GET', isArray: true, url: App.config.urlRoot + '/goods/brandlist'}
    });
}]);
