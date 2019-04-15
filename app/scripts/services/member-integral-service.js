'use strict';

App.factory('MemberIntegralService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/memberIntegral', {id: '@id'}, {
            'queryMemberIntegralList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/memberIntegral/list'}
    });
}]);
