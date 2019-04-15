'use strict';
App.factory('Login', ['$resource',
    function ($resource) {
        return $resource(App.config.urlRoot +'/staff', {id: '@id'}, {
            'login': {method: 'POST',  url: App.config.urlRoot + '/staff/login'},
            'captcha': {method: 'GET', isArray: false, url: App.config.urlRoot + '/staff/captcha'},
            'getStaff': {method: 'GET',  url: App.config.urlRoot + '/staff/currentStaff', isArray: false},
            'changeLang': {method: 'PUT',  url: App.config.urlRoot + '/staff/setLang', isArray: false},
            'logout': {method: 'POST',  url: App.config.urlRoot + '/staff/logout'}
    });
}]);
