'use strict';

App.factory('PlatformExpenditureService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/platformexpenditure', {id: '@id'}, {
           'queryExpendList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/platformexpenditure/expendlist'},
           'getSettlementCycle': {method: 'GET', isArray: false, url: App.config.urlRoot + '/platformexpenditure/settlementcycle'},
            'updateSettlementCycle': {method: 'GET', isArray: false, url: App.config.urlRoot + '/platformexpenditure/updatecycle/'},
    });
}]);
