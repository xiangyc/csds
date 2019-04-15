'use strict';

App.factory('OrderEvaluateService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/order', {id: '@id'}, {
           'queryOrderEvaluateList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/order/evaluatelist'}
    });
}]);
