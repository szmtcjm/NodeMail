define(function(require) {
    var action = GetQueryString("action")
    switch (action) {
        case "getfolder":
            parent.oMailbox.displayFolder(oInfo);
            break;
        case "getmessage":
            parent.oMailbox.displayMessage(oInfo);
            break;
        case "compose":
            parent.oMailbox.displayCompose();
            break;
        case "reply":
            parent.oMailbox.displayReply();
            break;
        case "replyall":
            parent.oMailbox.displayReplyAll();
            break;pa
        case "forward":
            parent.oMailbox.displayForward();
            break;
    }

    /**
     * [GetQueryString description]
     * @param {[type]} name
     */
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
});