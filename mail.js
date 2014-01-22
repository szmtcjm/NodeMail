var POP3Client = require("node-poplib");
var pop3client = new POP3Client(port, host, {
	tlserrs: false,
	enabletls: true,
	debug: false
});
var messagesList = pop3client.messagesList = [];
var messageBodies = pop3client.messageBodies = [];
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


POP3Client.listMessages = function(callback) {
    pop3client.list();
    pop3client.on("list", function(status, msgcount, msgnumber, data, rawdata) {
        if (status === false) {
            console.log("LIST failed");
            pop3client.quit();
        } else {
            messagesList.unshift(data);
            console.log("LIST success with " + msgcount + " element(s)");
        }
    });
}

POP3Client.getMessageBody = function(msgnumber, callback) {
    pop3client.retr(msgnumber);
    pop3client.on("retr", function(status, msgnumber, data, rawdata) {
        if (status === true) {
            console.log("RETR success for msgnumber " + msgnumber);
            //pop3client.dele(msgnumber);
            //pop3client.quit();
        } else {
            console.log("RETR failed for msgnumber " + msgnumber);
            pop3client.quit();
        }
    });
}

function parsed_header(rawHeaders) {
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
                returnHeaders[rawHeader[1]] = new Buffer(rawHeader[4], 'base64').toString();
            } else {
                returnHeaders[rawHeader[1]] = rawHeader[4]
            }
            
        }
    }
}

exports.pop3client = pop3client;