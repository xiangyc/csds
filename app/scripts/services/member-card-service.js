'use strict';

App.factory('MemberCardService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/memberCard', {id: '@id'}, {
            'queryMemberCardList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/memberCard/list'}
    });
}]);
