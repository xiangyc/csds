'use strict';
App.factory('BrandService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot + '/brand/:id', {id: '@id'}, {
        'queryBrandById': {method: 'GET', isArray: false, url: App.config.urlRoot + '/brand/query/:id'},
        'getTypeList': {method: 'GET', isArray: true, url: App.config.urlRoot + '/brand/brandList'},
        'deleteBrand': {method: 'POST', isArray: false, url: App.config.urlRoot + '/brand/:id'},
        'queryBrandList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/brand/list'}
        
    });
}]);
