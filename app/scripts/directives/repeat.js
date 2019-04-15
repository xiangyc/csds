/**
 * Created by andychen on 2016/5/20
 */
'use strict';

App.directive('repeatFinish',function($compile){
    return {
        link: function(scope){
            if(scope.$last){
                //向父控制器传递事件
                scope.$emit('repeatFinishEvent');

                $compile("<check-permission />")(scope);
            }
        }
    };
});

App.directive('repeatSelect',function($compile){
    return {
        link: function(scope){
            if(scope.$last){
                //向父控制器传递事件
                scope.$emit('repeatFinishEvent');

                $compile("<check-user />")(scope);
            }
        }
    };
});
