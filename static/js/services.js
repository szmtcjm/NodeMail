var mailServices = angular.module('mailServices', []);

mailServices.factory('messages', ['$http', '$rootScope', 'request', function($http, $rootScope, request) {
    var service = {
        messageCount: 0,
        folder: '1',
        messages: [],
        readMail: {}
    }
    return service;
}]);


mailServices.factory('request', ['$http', 'notice', function($http, notice) {
    var onRequest = false;
    return function(filter, callback) {
        if (onRequest) {
            notice.setNotice('正在加载，请稍后再试...');
            return;
        }
        onRequest = true;
        notice.setNotice('正在加载...');
        var sURL = filter.action,
            queryString = '';
        for (key in filter) {
            queryString += (queryString ? '&' : '?') + key + '=' + filter[key];
        }
        sURL += queryString;
        $http({method: 'GET', url: sURL}).
            success(function(data, status, headers, config) {
                if (typeof(callback) === 'function') {
                    callback(data, headers);
                }
                onRequest = false;
                notice.setNotice('');
            }).
            error(function(data, status, headers, config) {
                console.log(data);
                onRequest = false;
                notice.setNotice('');
            });
    };
}]);

mailServices.factory('notice', ['$rootScope', function($rootScope) {
    var notice = {
        noticeString: '',
        setNotice: function(theNotice) {
            notice.noticeString = theNotice;
            $rootScope.$broadcast('notice');
        }
    };
    return notice;
}]);

mailServices.factory('code', [function() {
    var reNameAndEmail = /(.*?)<(.*?)>/i;
    return {
        cleanupEmail: function(sText) {
            if (reNameAndEmail.test(sText)) {
                return RegExp.$1.replace(/"/g, "");
            } else {
                return sText;
            }
        },
        htmlEncode: function(sText) {
            if (sText) {
                return sText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
            } else {
                return "";
            }
        },
        encodeBody: function(oForm) {
            var aParams = [],
                i,
                sParam;

            for (i=0 ; i < oForm.elements.length; i++) {
                sParam = encodeURIComponent(oForm.elements[i].name);
                sParam += "=";
                sParam += encodeURIComponent(oForm.elements[i].value);
                aParams.push(sParam);
            }
            return aParams.join("&");
        }
    }
}]);