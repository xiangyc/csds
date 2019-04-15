'use strict';

App.factory('OrderRecordService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/order', {id: '@id'}, {
            'queryOrderRecordList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/order/orderRecord'},
            'queryOrderDetailById': {method: 'GET', isArray: false, url: App.config.urlRoot + '/order/detail'},
            'queryOrderList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/order/orderlist'},
           'queryOrderReturnList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/order/returnlist'},
           'addReturnOrder': {method: 'PUT', isArray: false, url: App.config.urlRoot + '/order/addreturnorder'},
           'orderReturnNotPass': {method: 'PUT', isArray: false, url: App.config.urlRoot + '/order/orderreturnnotpass'},
           'orderReturnPass': {method: 'PUT', isArray: false, url: App.config.urlRoot + '/order/orderreturnpass'},
           'getOrderPrescription': {method: 'GET', isArray: false, url: App.config.urlRoot + '/order/orderprescription'},
           'updatePrescription': {method: 'GET', isArray: false, url: App.config.urlRoot + '/order/updateprescription/'},
           'orderCheck': {method: 'GET', isArray: false, url: App.config.urlRoot + '/order/ordercheck/'}
    });
}]);
