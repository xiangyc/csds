'use strict';
App.factory('FeedbackService', ['$resource', function ($resource) {
    return $resource(App.config.urlRoot + '/feedback/:id', {}, {
        'addOrUpdate': {method: 'POST', isArray: false, url: App.config.urlRoot + '/feedback/update/:id'},
        'queryFeedbackById': {method: 'GET', isArray: false, url: App.config.urlRoot + '/feedback/query/:id'},
        'queryFeedbackList': {method: 'GET', isArray: false, url: App.config.urlRoot + '/feedback/list'},
        'deleteFeedback': {method: 'POST', isArray: false, url: App.config.urlRoot + '/feedback/delete'},
        'changeStatus': {method: 'PUT', isArray: false, url: App.config.urlRoot + '/feedback/changeStatus'}
    });
}]);
