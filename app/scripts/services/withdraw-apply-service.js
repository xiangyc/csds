'use strict';

App.factory('WithdrawApplyService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/withdraw', {id: '@id'}, {
            'queryWithdrawApplyList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/withdraw/list'},
            'applyWithdraw': {method: 'PUT', isArray: false, url: App.config.urlRoot + '/member/applywithdraw'},
            'withdrawNotPass': {method: 'PUT', isArray: false, url: App.config.urlRoot + '/withdraw/checkNotPass/:id'},
            'withdrawPass': {method: 'PUT', isArray: false, url: App.config.urlRoot + '/withdraw/checkPass/:id'}
    });
}]);
