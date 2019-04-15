'use strict';

App.factory('BusinessAmountService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/sellturnover', {id: '@id'}, {
           'queryBusinessAmountList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/sellturnover/business-list'}
    });
}]);
