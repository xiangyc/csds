'use strict';

App.factory('GoodSaleService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/statisticsproduct', {id: '@id'}, {
           'queryGoodsSaleList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/statisticsproduct/selldaylist'},
           'querySuperSaleList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/statisticsproduct/business-list'}
    });
}]);
