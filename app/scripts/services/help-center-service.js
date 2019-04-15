'use strict';
App.factory('HelpCenterService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot + '/helps/:id', {}, {
        'addOrUpdate': {method: 'POST', isArray: false, url: App.config.urlRoot + '/helps/addOrUpdate/:id'},
        'queryHelpById': {method: 'GET', isArray: false, url: App.config.urlRoot + '/helps/query/:id'},
        'queryHelpList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/helps/list'},
        'deleteHelp': {method: 'POST', isArray: false, url: App.config.urlRoot + '/helps/delete'}
    });
}]);
