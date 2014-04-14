var mailServices = angular.module('mailServices', []);

mailServices.factory('messages', ['$http', '$rootScope', 'request', function($http, $rootScope, request) {
    var service = {
        messageCount: 0,
        messages: [],
        folder: '1',
        refresh: function(folder, page) {
            var url = '/getFolder?folder='+ folder + '&page=' + page;
            request({action: 'getFolder', folder: folder, page: page}, function(data, headers) {
                service.messages = data.messages;
                service.messageCount = data.messageCount;
                $rootScope.$broadcast('messages.changeFolder');
                $rootScope.$broadcast('messages.update');
            });
        },
        emptyTrash: function() {
            request({action: 'emptyTrash'}, function() {
                if (service.folder === '2') {
                    service.messages = [];
                    service.messageCount = 0;
                    $rootScope.$broadcast('messages.update');
                } 
            });
            
        }
    }
    return service;
}]);

mailServices.factory('request', ['$http', function($http) {
    return function(filter, callback) {
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
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });
    };
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