define(function(require) {
    var oMailbox = require('./oMailbox'),
    	login = require("./login");

    window.oMailbox = oMailbox;
    oMailbox.load();
    login.checkLogin();
});


