'use strict';
App.factory('GoodsCategoryService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot + '/goodscategory/:id', {id: '@id'}, {
        'queryGoodsCategoryById': {method: 'GET', isArray: false, url: App.config.urlRoot + '/goodscategory/query/:id'},
        'queryGoodsCategoryList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/goodscategory/list'},
        'getParentGoodsCategoryList': {method: 'GET', isArray: true, url: App.config.urlRoot + '/goodscategory/goodsCategorylist'},
        'getChildList': {method: 'GET', isArray: true, url: App.config.urlRoot + '/goodscategory/goodsChildrenlist'},
        'getAllProductList': {method: 'GET', isArray: true, url: App.config.urlRoot + '/goodscategory/productTypelist'},
        'queryChildTypesByParent': {method: 'GET', isArray: true, url: App.config.urlRoot + '/goodscategory/childlist'},
        'deleteCategory': {method: 'POST', isArray: false, url: App.config.urlRoot + '/goodscategory/:id'},
        'getBrandList': {method: 'GET', isArray: true, url: App.config.urlRoot + '/goods/brandlist'}
        
    });
}]);
