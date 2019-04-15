'use strict';
App.factory('CouponService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot + '/coupon/:id', {id: '@id'}, {
        'queryCouponList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/coupon/list'},
        'queryCouponRecordsList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/coupon/recordslist'},
        'addOrUpdate': {method: 'POST', isArray: false, url: App.config.urlRoot + '/coupon/addOrUpdate'},
        'queryCouponById': {method: 'GET', isArray: false, url: App.config.urlRoot + '/coupon/query/:id'}
        
    });
}]);
