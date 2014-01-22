var Poplib = require("node-poplib");
var popemail;
var pop3client;
popemail.login = function() {
    pop3client = new Poplib(port, host, {
        tlserrs: false,
        enabletls: true,
        debug: false
    });
}
var messagesList = popemail.messagesList = [];

pop3client.on("error", function(err) {

        if (err.errno === 111) {
        	console.log("Unable to connect to server");
        } else {
        	console.log("Server error occurred");
        } 
        console.log(err);
});

pop3client.on("connect", function() {
        console.log("CONNECT success");
        pop3client.login(username, password);
});

pop3client.on("login", function(status, rawdata) {

    if (status) {
        console.log("LOGIN/PASS success");
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
        for (i = 0; i < msgcount; i++) {
            pop3client.top(i, 0);
            pop3client.retr(i);
        }
        messagesList.unshift(data);
        console.log("LIST success with " + msgcount + " element(s)");
    }
});

pop3client.on("top", function(status, msgnumber, data, rawdata) {
    if (status === true) {
        console.log("TOP success for msgnumber " + msgnumber);
        parseHeader(rawdata);
    } else {
        console.log("TOP failed for msgnumber " + msgnumber);
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

popemail.checkMessages = function(callback) {
    pop3client.list();
}

function parseHeader(rawHeaders) {
    var rawHeadersArray = rawHeader.split("\r\n"),
        rawHeadersArraylen = rawHeadersArray.length;
        rawHeader,
        headerPattern = /\s*(.+):\s*=\?(.+?)\?([B|Q])\?(.*)=\?/,
        i,
        returnHeaders = {};
    for (i = 0; i < rawHeadersArraylen; i++) {
        rawHeader = rawHeadersArray[i].match(headerPattern);
        if (rawHeader) {
            if (rawHeader[3] === "B") {
                //未解决中文编码，现在默认utf8
                returnHeaders[rawHeader[1]] = new Buffer(rawHeader[4], 'base64').toString();
            } else {
                returnHeaders[rawHeader[1]] = rawHeader[4]; //quoted-printable 解不了码
            }
        }
    }
    messagesList.push(returnHeaders);
}

function parseMessageBody(rawBody) {
}

exports.popemail = popemail;