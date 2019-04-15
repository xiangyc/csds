'use strict';

App.factory('AccessStatisticsService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot +'/statisticsaccess', {id: '@id'}, {
           'queryAccessList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/statisticsaccess/accesslist'}
    });
}]);
