define(function(require, exports, module) {
    var constant = require('./constant');

    var reNameAndEmail = /(.*?)<(.*?)>/i;

    function cleanupEmail(sText) {
        if (reNameAndEmail.test(sText)) {
            return RegExp.$1.replace(/"/g, "");
        } else {
            return sText;
        }
    }

    function htmlEncode(sText) {
        if (sText) {
            return sText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
        } else {
            return "";
        }
    }

    function getRequestBody(oForm) {
        var aParams = new Array();

        for (var i=0 ; i < oForm.elements.length; i++) {
            var sParam = encodeURIComponent(oForm.elements[i].name);
            sParam += "=";
            sParam += encodeURIComponent(oForm.elements[i].value);
            aParams.push(sParam);
        }

        return aParams.join("&");
    }

    module.exports = {cleanupEmail:cleanupEmail, htmlEncode:htmlEncode,getRequestBody:getRequestBody};
});