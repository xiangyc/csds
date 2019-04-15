'use strict';

App.factory('SaleAmountService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/sellturnover', {id: '@id'}, {
           'querySaleAmountList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/sellturnover/selllist'},
           'queryBusinessAmountList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/sellturnover/business-list'}
    });
}]);
