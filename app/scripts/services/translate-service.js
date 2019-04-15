'use strict';
App.factory('Trans', ['$translate', function ($translate) {
    var Trans = {
        trans:function(key) {
            if(key){
                return $translate.instant(key);
            }
            return key;
        }
    }
    return Trans;
}]);
