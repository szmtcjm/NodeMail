define(function(require, exports, module) {

    var constant = {};

    var sImagesDir = "images/";
    //URLs
    constant.urls = {sAjaxMailURL:"AjaxMailAction.php",
        sAjaxMailNavigateURL:"AjaxMailNavigate.php",
        sAjaxMailAttachmentURL:"AjaxMailAttachment.php",
        sAjaxMailSendURL:"AjaxMailSend.php",
        sRestoreIcon:sImagesDir + "icon_restore.gif",
        sDeleteIcon:sImagesDir + "icon_delete.gif",
        sInfoIcon:sImagesDir + "icon_info.gif",
        sErrorIcon:sImagesDir + "icon_alert.gif",
    };

    constant.urls.aPreloadImages = [constant.urls.sRestoreIcon, constant.urls.sDeleteIcon, constant.urls.sInfoIcon, constant.urls.sErrorIcon];

    constant.string = {
        sEmptyTrashConfirm: "You are about to permanently delete everything in the Trash. Continue?",
        sEmptyTrashNotice: "The Trash has been emptied.",
        sDeleteMailNotice: "The message has been moved to Trash.",
        sRestoreMailNotice: "The message has been moved to Inbox.",
        sTo: "To ",
        sCC: "CC ",
        sBCC: "BCC ",
        sFrom: "From ",
        sRestore: "Restore",
        sDelete: "Move to Trash"
    };

    constant.iShowNoticeTime = 5000;

    constant.folders = {
        INBOX: 1,
        TRASH: 2,
        aFolders: ["","Inbox", "Trash"]
    };

    module.exports = constant;
});