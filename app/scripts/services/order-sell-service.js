'use strict';

App.factory('OrderSaleService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/ordersell', {id: '@id'}, {
           'queryOrderSaleList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/ordersell/selldaylist'},
           'queryReturnedGoodsList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/ordersell/return-order-list'},
           'findOrderStatistics': {method: 'GET', isArray: false, url: App.config.urlRoot + '/ordersell/statistics'}
    });
}]);
