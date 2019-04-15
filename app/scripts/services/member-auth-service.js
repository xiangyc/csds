'use strict';
App.factory('MemberAuthService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot + '/member/:id', {id: '@id'}, {
        'queryMemberAuthList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/memberauth/list'},
        'checkNotPass': {method: 'PUT', isArray: false, url: App.config.urlRoot + '/memberauth/checkNotPass/:id'},
        'checkPass': {method: 'PUT', isArray: false, url: App.config.urlRoot + '/memberauth/checkPass/:id'}
    });
}]);
