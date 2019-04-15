'use strict';

App.factory('FinanceRecordService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/statisticsfinance', {id: '@id'}, {
            'queryFinanceRecordList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/statisticsfinance/financeRecord'},
            'queryPlatformSettlementList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/platformSettlement/settle-list'},
            'queryStoreTurnoverList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/statisticsfinance/storeTurnover'},
            'queryStoresTurnoverList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/statisticsfinance/storesTurnover'},
            'querySalesVolumeList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/statisticsfinance/salesVolume'},
            'findSalesVolumeDetail': {method: 'GET', isArray: false, url: App.config.urlRoot + '/statisticsfinance/sales-detail'},
            'findStoresTurnoverDetail': {method: 'GET', isArray: false, url: App.config.urlRoot + '/statisticsfinance/all-detail'},
            'findStoreTurnoverDetail': {method: 'GET', isArray: false, url: App.config.urlRoot + '/statisticsfinance/single-detail'}
    });
}]);
