'use strict';

App.factory('PlatformIncomeService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/platformincome', {id: '@id'}, {
           'queryIncomeList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/platformincome/incomelist'},
           'queryIncomeDetail': {method: 'GET', isArray: false, url: App.config.urlRoot + '/platformincome/incomedetail'},
           'getSettlementCycle': {method: 'GET', isArray: false, url: App.config.urlRoot + '/platformincome/settlementcycle'},
           'updateSettlementCycle': {method: 'GET', isArray: false, url: App.config.urlRoot + '/platformincome/updatecycle/'},
    });
}]);
