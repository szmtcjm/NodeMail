var mailServices = angular.module('mailServices', []);

mailServices.factory('request', ['$http', function($http) {
    return function(args, sAction, folder, page, sId, fnCallback, context) {
        var sURL = args.sAction + "?folder=" + args.folder + "&page=" + args.page;
        if (args.sId) {
            sURL += "&id=" + args.sId;
        }
        $http({method: 'GET', url: sURL}).
            success(function(data, status, headers, config) {
                if (jqXHR.statusText === "OK") {
                    fnCallback.call(context, data);
                } else if (jqXHR.statusText === "TIMEOUT") {
                    that.showNotice("error", "请求超时");
                }
            }).
            error(function(data, status, headers, config) {
     
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