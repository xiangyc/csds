'use strict';

App.factory('BankCardService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/bankCard', {id: '@id'}, {
            'queryBankCardList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/bankCard/list'}
    });
}]);
