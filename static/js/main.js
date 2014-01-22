define(function(require) {
    var oMailbox = require('./oMailbox');
    window.oMailbox = oMailbox;
    oMailbox.load();
});


