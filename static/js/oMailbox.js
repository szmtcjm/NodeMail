define(function(require, exports, module) {
    var constant = require('./constant');
    var helperFun = require('./helperFunctions');
    require('./json');
    require('./zxml');
    require("/frontlib/jquery/jquery-2.0.3.min.js");
    /**
     * The mailbox.
     */
    var oMailbox = {

        //-----------------------------------------------------
        // Properties
        //-----------------------------------------------------

        //folder-related information
        info: new Object(),   //information about the mail being displayed
        processing: false,    //determines if processing is taking place
        message: new Object(),//information about the current message
        nextNotice: null,    //information to be displayed to the user

        //-----------------------------------------------------
        // Data-Related Methods
        //-----------------------------------------------------

        /**
         * Moves a message to the trash.
         * @scope protected
         * @param sId The ID of the message.
         */
        deleteMessage: function (sId) {
            this.nextNotice = constant.string.sDeleteMailNotice;
            this.request("delete", loadAndRender, sId);
        },

        /**
         * Moves a message to the trash.
         * @scope protected
         * @param sId The ID of the message.
         */
        emptyTrash: function () {
            if (confirm(constant.string.sEmptyTrashConfirm)) {
                this.nextNotice = constant.string.sEmptyTrashNotice;
                if (this.info.folder == constant.folders.TRASH) {
                    this.request("empty", loadAndRender);
                } else {
                    this.request("empty", execute);
                }
            }
        },

        /**
         * Retrieves messages for the current folder and page.
         * @scope protected
         * @param iFolder The folder to retrieve.
         * @param iPage The page in that folder to retrieve.
         */
        getMessages: function (iFolder, iPage) {
            this.info.folder = iFolder;
            this.info.page = iPage;
            this.request("getFolder", this.displayFolder, undefined, oMailbox);
        },

        /**
         * Loads data from the server into the mailbox.
         * @scope protected
         * @param vInfo A JSON-encoded string containing mailbox information or an info object.
         */
        loadInfo: function (vInfo) {
            if (typeof vInfo == "string") {
                this.info = JSON.parse(vInfo);
            } else {
                this.info = vInfo;
            }
        },

        /**
         * Loads message data from the server into the mailbox.
         * @scope protected
         * @param vMessage A JSON-encoded string containing message information or a message object.
         */
        loadMessage: function (vMessage) {
            if (typeof vMessage == "string") {
                this.message = JSON.parse(vMessage);
            } else {
                this.message = vMessage;
            }
        },

        /**
         * Makes a request to the server.
         * @scope protected
         * @param sAction The action to perform.
         * @param fnCallback The function to call when the request completes.
         * @param sId The ID of the message to act on (optional).
         */
        navigate: function (sAction, sId) {
            if (this.processing) return;
            try {
                this.setProcessing(true);
                var sURL = "getFolder";
                this.iLoader.src = sURL;
            } catch (oException) {
                this.showNotice("error", oException.message);
            }
        },

        /**
         * Retrieves messages for the next page in the current folder.
         * @scope protected
         * @param iFolder The folder to retrieve.
         * @param iPage The page in that folder to retrieve.
         */
        nextPage: function () {
            this.getMessages(this.info.folder, this.info.page+1);
        },

        /**
         * Retrieves messages for the previous page in the current folder.
         * @scope protected
         * @param iFolder The folder to retrieve.
         * @param iPage The page in that folder to retrieve.
         */
        prevPage: function () {
            this.getMessages(this.info.folder, this.info.page-1);
        },

        /**
         * Begins download of the given message.
         * @param sId The message ID to retrieve.
         */
        readMessage: function (sId) {
            this.navigate("getmessage", sId);
        },

        /**
         * Refreshes the current folder's view.
         * @scope protected
         * @param iFolder The ID of the new folder to refresh.
         */
        refreshFolder: function (iFolder) {
            this.info.folder = iFolder;
            this.info.page = 1;
            this.request("getfolder", loadAndRender);
        },

        /**
         * [request description]
         * @param  {[type]} aAction
         * @param  {[type]} fnCallback
         * @param  {[type]} sId
         * @return {[type]}
         */
        request: function(sAction, fnCallback, sId, context) {
            var that = this;
            if (that.processing) return;
            that.setProcessing(true);
            var sURL = sAction + "?folder=" + that.info.folder + "&page=" + that.info.page;
            if (sId) {
                sURL += "&id=" + sId;
            }
            $.get(sURL, function(data, textStatus, jqXHR) {
                if (jqXHR.statusText === "OK") {
                    fnCallback.call(context, data);
                } else if (jqXHR.statusText === "TIMEOUT") {
                    that.showNotice("error", "请求超时");
                }
            });
            $(document).ajaxError(function(event, request, settings, exception) {
                console.log(event);
                console.log(exception);
                console.log(settings);
            });


        },

        /**
         * Moves a message from the trash to the constant.folders.INBOX.
         * @scope protected
         * @param sId The ID of the message.
         */
        restoreMessage: function (sId) {
            this.nextNotice = constant.string.sRestoreMailNotice;
            this.request("restore", loadAndRender, sId);
        },

        /**
         * Makes a request to the server.
         * @scope protected
         * @param sAction The action to perform.
         * @param fnCallback The function to call when the request completes.
         * @param sId The ID of the message to act on (optional).
         */
        sendMail: function () {
            if (this.processing) return;
            $("#divComposeMailForm").hide();
            $("#divComposeMailStatus").show();

            this.setProcessing(true);
            var sData = helperFun.getRequestBody($("form").get(0));
            $.ajax({
                type: "POST",
                url: constant.urls.sAjaxMailSendURL,
                data: sData,
                success: sendConfirmation,
                dataType: "json"
            });
        },

        /**
         * Sets the UI to be enabled or disabled.
         * @scope protected
         * @param bProcessing True to enable, false to disable.
         */
        setProcessing: function (bProcessing) {
            this.processing = bProcessing;
            if(bProcessing) {
               $("#divFolderStatus").show(); 
           }else {
               $("#divFolderStatus").hide();
           }
        },

        /**
         * Switches the view to a new folder.
         * @scope protected
         * @param iNewFolder The ID of the new folder to switch to.
         */
        switchFolder: function (iNewFolder) {
            this.getMessages(iNewFolder, 1);
        },

        //-----------------------------------------------------
        // UI-Related Methods
        //-----------------------------------------------------

        /**
         * Cancels the reply and sends back to read mail view.
         * @scope protected
         */
        cancelReply: function () {
            history.go(-1);
        },

        compose: function () {
            this.navigate("compose");
        },

        displayCompose: function () {
            this.displayComposeMailForm("", "", "", "");
        },

        displayComposeMailForm: function (sTo, sCC, sSubject, sMessage) {
            $("#txtTo").val(sTo);
            $("#txtCC").val(sCC);
            $("#txtSubject").val(sSubject);
            $("#txtSubject").val(sSubject);
            $("#txtMessage").val(sMessage);

            $("#divReadMail").hide();
            $("#divComposeMail").show();
            $("#divFolder").hide();
            this.setProcessing(false);
        },

        displayFolder: function (oInfo) {
            this.loadInfo(oInfo);
            this.renderFolder();
            this.setProcessing(false);
        },

        displayForward: function () {
            this.displayComposeMailForm("", "",
                "Fwd: " + this.message.subject,
                "---------- Forwarded message ----------\n" + this.message.message);
        },

        displayMessage: function (oMessage) {
            this.loadMessage(oMessage);
            this.renderMessage();
            this.setProcessing(false);
        },

        displayReply: function () {
            var sTo = this.message.from;
            var sCC = "";

            this.displayComposeMailForm(sTo, sCC, "Re: " + this.message.subject,
                "\n\n\n\n\n" + this.message.from + "said: \n" + this.message.message);

        },

        displayReplyAll: function () {
            var sTo = this.message.from + "," + this.message.to;
            var sCC = this.message.cc;

            this.displayComposeMailForm(constant.string.sTo, sCC, "Re: " + this.message.subject,
                "\n\n\n\n\n" + this.message.from + "said: \n" + this.message.message);

        },

        forward: function () {
            this.navigate("forward");
        },

        /**
         * Initializes DOM pointers and other property values.
         * @scope protected
         */
        init: function () {
            /*var colAllElements = document.getElementsByTagName("*");
            if (colAllElements.length == 0) {
                colAllElements = document.all;
            }

            for (var i=0; i < colAllElements.length; i++) {
                if (colAllElements[i].id.length > 0) {
                    this[colAllElements[i].id] = colAllElements[i];
                }
            }*/
            //assign event handlers
            $("#imgPrev").click(function () {
                oMailbox.prevPage();
            });

            $("#imgNext").click(function () {
                oMailbox.nextPage();
            });

            $("#spnCompose").click(function () {
                oMailbox.compose();
            });

            $("#spnInbox").click(function () {
                if (oMailbox.info.folder == constant.folders.INBOX) {
                    oMailbox.refreshFolder(constant.folders.INBOX);
                } else {
                    oMailbox.switchFolder(constant.folders.INBOX);
                }
            });

            $("#spnTrash").click(function () {
                if (oMailbox.info.folder == constant.folders.TRASH) {
                    oMailbox.refreshFolder(constant.folders.TRASH);
                } else {
                    oMailbox.switchFolder(constant.folders.TRASH);
                }
            });
            $("#spnEmpty").click(function () {
                oMailbox.emptyTrash();
            });
            $("#spnReply").click(function () {
                oMailbox.reply(false);
            });
            $("#spnReplyAll").click(function () {
                oMailbox.reply(true);
            });
            $("#spnForward").click(function () {
                oMailbox.forward();
            });
            $("#spnCancel").click(function () {
                oMailbox.cancelReply();
            });
            $("#spnSend").click(function () {
                oMailbox.sendMail();
            });
            $("#aaddCC").click(function () {
                oMailbox.addCC();
            });
            $("#aremoveCC").click(function() {
                oMailbox.removeCC();
            });

            $("#aremoveCC").hide();
            $("#CC").hide();
        },

        /**
         * Initializes and loads the mailbox with the initial page.
         * @scope protected
         */
        load: function () {
            this.init();
            this.getMessages(constant.folders.INBOX, 1);
            //setInterval(this.timingGetMail, 1000);
        },

        /**
         * Renders the messages on the screen.
         * @scope protected
         */
        renderFolder: function () {

            var $imaTd;
            var i;
            var oMessage;
            var $NewTR;
            var $imgTd;
            var container;
            var $tBody = $("#tblMain").children("tBody");

            $tBody.children().remove();
            //add a new row for each message
            if (this.info.messages.length) {
                for (i = 0; i < this.info.messages.length; i++) {
                    oMessage = this.info.messages[i];
                    $NewTR = $("#trTemplate").clone();
                    $NewTR.attr("id", "tr" + oMessage.id)
                    $NewTR.click(readMessage);

                    if (oMessage.unread) {
                        $NewTR.attr("class", "new")
                    }

                    $imgTd = $NewTR.children(".img");
                    $imgTd.attr("id", oMessage.id);
                    if (this.info.folder == constant.folders.TRASH) {
                        $imgTd.click(restoreMessage);
                        $imgTd.children().attr("src", constant.urls.sRestoreIcon);
                        $imgTd.attr("title", constant.string.sRestore);
                    } else {
                        $imgTd.click(deleteMessage);
                        $imgTd.children().attr("src", constant.urls.sDeleteIcon);
                        $imgTd.attr("title", constant.string.sDelete);
                    }

                    $NewTR.children(".from").text(helperFun.cleanupEmail(oMessage.from));
                    if (oMessage.hasAttachments) {
                        $NewTR.children(".attachment").show();
                    } else {
                        $NewTR.children(".attachment").children().hide();
                    }
                    $NewTR.children(".subject").text(helperFun.htmlEncode(oMessage.subject));
                    $NewTR.children(".date").text(oMessage.date);
                    $tBody.append($NewTR);
                }
            } else {
                $tBody.append($("#trNoMessages").clone());
            }

            //only change folder name if it's different
            if ($("#hFolderTitle").html() != constant.folders.aFolders[this.info.folder]) {
                $("#hFolderTitle").html(constant.folders.aFolders[this.info.folder]);
            }

            //update unread message count for Inbox
            this.updateUnreadCount(this.info.unreadCount);

            //set up the message count (hide if there are no messages)
            if (this.info.messages.length) {
                $("#spnItems").show();
            } else {
                $("#spnItems").hide();
            }
            $("#spnItems").text(this.info.firstMessage + "-" + (this.info.firstMessage + this.info.messages.length - 1) + " of " + this.info.messageCount);

            //determine show/hide of pagination images
            if (this.info.pageCount > 1) {
                if(this.info.page < this.info.pageCount) {
                    $("#imgNext").show();
                }
                if(this.info.page > 1) {
                    $("#imgPrev").show();
                }
            } else {
                $("#imgNext").hide();
                $("#imgPrev").hide();
            }

            $("#divFolder").show();
            $("#divReadMail").hide();
            $("#divComposeMail").hide();
        },

        renderMessage: function () {
            var i,
                $ulAttachments = $("#ulAttachments"), 
                $liAttachments = $("#liAttachments"), 
                liHtml,
                currmessage = this.message;
            if (currmessage.subject.length > 50) {
                currmessage.subject = currmessage.subject.slice(0, 20) + "..."
            }
            $("#hSubject").html(helperFun.htmlEncode(currmessage.subject));
            $("#divMessageFrom").html(constant.string.sFrom + " " + helperFun.htmlEncode(currmessage.from));
            $("#divMessageTo").html(constant.string.sTo + " " + helperFun.htmlEncode(currmessage.to));
            $("#divMessageCC").html(currmessage.cc.length ? constant.string.sCC + " " + helperFun.htmlEncode(currmessage.cc) : "");
            $("#divMessageBCC").html(currmessage.bcc.length ? constant.string.sBCC + " " + helperFun.htmlEncode(currmessage.bcc) : "");
            $("#divMessageDate").html(currmessage.date);
            $("#divMessageBody").html(currmessage.message);

            if (currmessage.hasAttachments) {
                $ulAttachments.show();
                var attachmentsLen = currmessage.attachments;
                for (i = 0; i < attachmentsLen.length; i++) {
                    liHtml = "<li class='attachment'>"
                    liHtml += "<a href=\"" + constant.urls.sAjaxMailAttachmentURL + "?id=" + currmessage.attachments[i].id + "\" target=\"_blank\">" + currmessage.attachments[i].filename + "</a> (" + currmessage.attachments[i].size + ")";
                    liHtml += "</li>"
                    $ulAttachments.append(liHtml);
                }
                $liAttachments.show();
            } else {
                $ulAttachments.hide();
                $liAttachments.hide();
                $ulAttachments.html("");
            }

            this.updateUnreadCount(currmessage.unreadCount);
            $("#divFolder").hide();
            $("#divReadMail").show();
            $("#divComposeMail").hide();
        },

        /**
         * Sets up the screen to reply to an e-mail.
         * @scope protected
         * @param blnAll Set to true for "reply to all"
         */
        reply: function (blnAll) {
            this.navigate("reply" + (blnAll ? "all" : ""));
        },

        /**
         * Shows a message on the screen.
         * @scope protected
         * @param sType The type of message to display.
         * @param sMessage The message to display.
         */
        showNotice: function (sType, sMessage) {
            var $divNotice = $("#divNotice");
            $divNotice.addClass(sType);
            $divNotice.text(sMessage);
            $divNotice.show();
            setTimeout(function () {
                $divNotice.hide();
            }, constant.iShowNoticeTime);
        },

        /**
         * Updates the count of unread messages displayed on
         * the screen.
         * @scope protected
         * @param iCount The number of unread messages.
         */
        updateUnreadCount: function (iCount) {
            $("#spnUnreadMail").text(iCount > 0 ? " (" + iCount + ")" : "");
        },

        /**
         * [addCC description]
         */
        addCC: function () {
           $("#CC").show();
           $("#aaddCC").hide();
           $("#aremoveCC").show();
        },

        /**
         * [removeCC description]
         * @return {[type]}
         */
        removeCC: function () {
            $("#CC").hide();
            $("#aremoveCC").hide();
            $("#aaddCC").show();
        },

        /**
         * [timingGetMail description]
         * @return {[type]} [description]
         */
        timingGetMail: function () {
            var XMLHttpR = new XMLHttpRequest(),
                response,
                that = this,
                messagesInfo,
                messages;
            XMLHttpR.onreadystatechange = function () {
                if (XMLHttpR.readyState === 4) {
                    if (XMLHttpR.status === 200) {
                        response = XMLHttpR.responseText;
                        if(response === "{}") {
                            return;
                        }
                        if (typeof response == "string") {
                            messagesInfo = JSON.parse(response);
                        } else {
                            messagesInfo = response;
                        }
                        messages = messagesInfo.messages;
                        if(messages.length > 0) {
                            oMailbox.insertMessages(messages);
                        }
                    }
                }
            }
            XMLHttpR.open("GET",constant.urls.sAjaxMailTimingGetMail ,true);
            XMLHttpR.send(null);
            /*$.get(constant.urls.sAjaxMailTimingGetMail, function(data, textStatus, jqXHR) {
                alert(data)
            });*/
        },

        insertMessages: function (messagesInfo) {
            var messagesCount = messagesInfo.length,
                oMessage,
                $NewTR,
                $imgTd,
                $tBody = $("#tblMain").children("tBody"),
                i;

            var tbody = document.getElementById("tblMain").getElementsByTagName("tBody")[0];
            var childrenTd = tbody.childNodes;
            if (this.info.firstMessage === 1) { 
                for (i = 0; i < messagesCount; i++) {
                    oMessage = messagesInfo[i];
                    $NewTR = $("#trTemplate").clone();
                    $NewTR.attr("id", "tr" + oMessage.id)
                    $NewTR.click(readMessage);
                    $NewTR.attr("class", "new")

                    $imgTd = $NewTR.children(".img");
                    $imgTd.attr("id", oMessage.id);
                    if (this.info.folder == constant.folders.TRASH) {
                        $imgTd.click(restoreMessage);
                        $imgTd.children().attr("src", constant.urls.sRestoreIcon);
                        $imgTd.attr("title", constant.string.sRestore);
                    } else {
                        $imgTd.click(deleteMessage);
                        $imgTd.children().attr("src", constant.urls.sDeleteIcon);
                        $imgTd.attr("title", constant.string.sDelete);
                    }

                    $NewTR.children(".from").text(helperFun.cleanupEmail(oMessage.from));
                    if (oMessage.hasAttachments) {
                        $NewTR.children(".attachment").show();
                    } else {
                        $NewTR.children(".attachment").children().hide();
                    }
                    $NewTR.children(".subject").text(helperFun.htmlEncode(oMessage.subject));
                    $NewTR.children(".date").text(oMessage.date);
                    $tBody.prepend($NewTR);
                    
                    tbody.removeChild(childrenTd[childrenTd.length - 1]);
                    delete childrenTd[length - 1];
                }
            }
            
                //修改未读邮件数和邮件总数
                this.info.messageCount += messagesCount;
                this.info.unreadCount += messagesCount;
                var splItem = document.getElementById("spnItems");
                var splItemString = splItem.innerText.split("of")[0]; 
                splItem.innerText = splItemString + "of " + this.info.messageCount;
                this.updateUnreadCount(this.info.unreadCount);
        },

        test: function() {
            alert(this);
        }
        
        
    };

    /*-------------------------------------------------------
     * Callback Functions
     *-------------------------------------------------------*/

    /**
     * Callback function to execute a client-server request and display
     * a notification about the result.
     * @scope protected.
     * @param sInfo The information returned from the server.
     */
    function execute(sInfo) {
        if (oMailbox.nextNotice) {
            oMailbox.showNotice("info", oMailbox.nextNotice);
            oMailbox.nextNotice = null;
        }
        oMailbox.setProcessing(false);
    }

    /**
     * Callback function to execute a client-server request and then
     * load and display new mail information.
     * @scope protected.
     * @param sInfo The information returned from the server.
     */
    function loadAndRender(sInfo) {

        oMailbox.loadInfo(sInfo);
        oMailbox.renderFolder();

        if (oMailbox.nextNotice) {
            oMailbox.showNotice("info", oMailbox.nextNotice);
            oMailbox.nextNotice = null;
        }
        oMailbox.setProcessing(false);
    }

    /**
     * The callback function when attempting to send an e-mail.
     * @scope protected
     * @param sData The data returned from the server.
     */
    function sendConfirmation(sData) {
        if (sData.error) {
            alert("An error occurred:\n" + sData.message);
        } else {
            oMailbox.showNotice("info", sData.message);
            $("#divComposeMail").hide();
            $("#divReadMail").hide();
            $("#divFolder").show();
        }
        $("#divComposeMailForm").show();
        $("#divComposeMailStatus").hide();
        oMailbox.setProcessing(false);
    }

    /**
     * [readMessage description]
     * @return {[type]}
     */
    function readMessage() {
        oMailbox.readMessage(this.id.substring(2));
    }
    /**
     * [deleteMessage description]
     * @return {[type]}
     */
    function deleteMessage() {
        oMailbox.deleteMessage(this.id);
    }
    /**
     * [restoreMessage description]
     * @return {[type]}
     */
    function restoreMessage() {
        oMailbox.restoreMessage(this.id);
    }

    module.exports = oMailbox;
});