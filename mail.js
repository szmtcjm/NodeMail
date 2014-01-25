var Poplib = require("poplib");
var events = require("events");
var util = require("util");
var mimelib = require("mimelib");
var popemail = {};
var pop3client;

var messagesList = popemail.messagesList = [];

popemail.on = function(event, callback) {
    pop3client.on(event, callback);
}

popemail.checkMail = function(request, response) {
    var hasSend = false;
    response.on("finish", function(){
        hasSend = true;
    });

    pop3client = new Poplib(995, "pop.126.com", {
        tlserrs: false,
        enabletls: true,
        debug: false
    });

    pop3client.on("error", function(err) {
        if (err.errno === "ETIMEDOUT") {
            console.log("Unable to connect to server");
        } else {
            console.log(err);
        }
        if (!hasSend) {
            response.setHeader("Content-Type", "application/json");
            response.writeHead(200, "TIMEOUT");
            response.end(JSON.stringify(err));
        }
    });

    pop3client.on("connect", function() {
        console.log("CONNECT success");
        pop3client.login("szmtcjm@126.com", "60c78J91m");
    });

    pop3client.on("login", function(status, rawdata) {

        if (status) {
            console.log("LOGIN/PASS success");
            pop3client.stat();
        } else {
            console.log("LOGIN/PASS failed");
            pop3client.quit();
        }
    });

    pop3client.on("list", function(status, msgcount, msgnumber, data, rawdata) {
        var i;
        if (status === false) {
            console.log("LIST failed");
            pop3client.quit();
        } else {
            //pop3client.top(10, 0);
            console.log("LIST success with " + msgcount + " element(s)");
        }
    });

    pop3client.on("top", function(status, msgnumber, data, rawdata) {
        if (status === true) {
            console.log("TOP success for msgnumber " + msgnumber);
            parseHeader(data, msgnumber);
            if (msgnumber === 1) {
                pop3client.emit("end");
                pop3client.stat();
                //pop3client.quit();
            } else {
                pop3client.top(msgnumber - 1, 0);
            }
        } else {
            console.log("TOP failed for msgnumber " + msgnumber);
            pop3client.quit();
        }
    });

    pop3client.on("stat", function(status, data, rawdata) {
        var pattern = /^\+OK\s(\d+)\s(\d+)/;
        var msgcount;
        if (status === true) {
            console.log("STAT success");
            msgcount = +rawdata.match(pattern)[1];
            pop3client.top(10, 0);
        } else {
            console.log("STAT failed");
            pop3client.quit();
        }
    });

    pop3client.on("retr", function(status, msgnumber, data, rawdata) {
        if (status === true) {
            console.log("RETR success for msgnumber " + msgnumber);
            parseMessageBody(rawdata);
        } else {
            console.log("RETR failed for msgnumber " + msgnumber);
            pop3client.quit();
        }
    });
}

function parseHeader(rawHeaders, msgnumber) {
    var rawHeadersArray = rawHeaders.split("\r\n"),
        rawHeadersArraylen = rawHeadersArray.length,
        rawHeader,
        headerPattern = /(.+):\s*(?:=\?(.+?)\?([B|Q])\?|)([^\?]*)(?:\?|)/,
        i,
        returnHeaders = {};
    for (i = 0; i < rawHeadersArraylen; i++) {
        rawHeader = rawHeadersArray[i].match(headerPattern);
        if (rawHeader) {
            rawHeader[1] = rawHeader[1].toLowerCase();
            if (rawHeader[3] === "B") {
                returnHeaders[rawHeader[1]] = mimelib.decodeBase64(rawHeader[4], rawHeader[2]);
            } else if (rawHeader[3] === "Q"){
                returnHeaders[rawHeader[1]] = mimelib.decodeQuotedPrintable(rawHeader[4], rawHeader[2]); //quoted-printable 
            } else {
                returnHeaders[rawHeader[1]] = rawHeader[4]; //未编码
            }
        }
    }
    returnHeaders.unread = true;
    messagesList[msgnumber - 1] = returnHeaders;
}

function parseMessageBody(rawBody) {}

module.exports = popemail;