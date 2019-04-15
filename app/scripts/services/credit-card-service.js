'use strict';

App.factory('CreditCardService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/creditCard', {id: '@id'}, {
            'queryCreditCardList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/creditCard/list'}
    });
}]);
