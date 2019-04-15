'use strict';
App.factory('SysCouponService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot + '/coupon/:id', {id: '@id'}, {
        'queryCouponList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/coupon/list'},
        'addOrUpdate': {method: 'POST', isArray: false, url: App.config.urlRoot + '/coupon/addOrUpdate'},
        'queryCouponById': {method: 'GET', isArray: false, url: App.config.urlRoot + '/coupon/query/:id'},
        'grantCoupon': {method: 'GET', isArray: false, url: App.config.urlRoot + '/coupon/grantcoupon/'}
    });
}]);
