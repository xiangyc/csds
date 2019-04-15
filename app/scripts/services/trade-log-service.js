'use strict';

App.factory('TradeLogService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/tradeLog', {id: '@id'}, {
           'queryTradeLogList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/tradeLog/list'},
           'queryPayLogList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/tradeLog/pay-list'}
    });
}]);
