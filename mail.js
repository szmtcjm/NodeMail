var Poplib = require("poplib");
var events = require("events");
var util = require("util");
var mimelib = require("mimelib");
var Server = require('mongodb').Server;
var Db = require('mongodb').Db;
var globalDb = new Db('Mail', new Server('127.0.0.1', 27017), {safe:false});
var popemail = {};
var pop3client;

var messagesList = [];

function connectToPopServer() {
    if (!pop3client) {
        pop3client = new Poplib(995, "pop.163.com", {
            tlserrs: false,
            enabletls: true,
            debug: false
        });
    }
}
connectToPopServer();

pop3client.on("error", function(err) {
    if (err.errno === "ETIMEDOUT") {
        console.log("Unable to connect to server");
    } else {
        console.log(err);
    }
});

pop3client.on("connect", function() {
    console.log("CONNECT success");
    pop3client.login("szmt_cjm@163.com", "cjmcjm");
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
            insertDb(messagesList.splice(0));
            pop3client.quit();
            pop3client = undefined;
            return;
        }
        if (msgnumber % 20 === 0) {
            insertDb(messagesList.splice(0));
        }
        pop3client.top(msgnumber - 1, 0);
        pop3client.dele(msgnumber);
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
        if (msgcount !== 0) {
            pop3client.top(msgcount, 0);
        } else {
            console.log("There is no message");
        }
        
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

pop3client.on("dele", function(status, msgnumber, data, rawdata) {
    if (status == true) {
        console.log("DELE success for msgnumber " + msgnumber);
    } else {
        console.log("DELE failed for msgnumber " + msgnumber);
        //pop3client.quit();
    }
});

pop3client.on("noop", function(status, rawdata) {

    if (status) {

        console.log("NOOP success");
        //client.stat();

    } else {

        console.log("NOOP failed");
        //client.quit();

    }

});

pop3client.on("locked", function(cmd) {
    console.log("Current command has not finished yet. You tried calling " + cmd);
});
pop3client.on("invalid-state", function(cmd) {
    console.log("Invalid state. You tried calling " + cmd);
});


setInterval(connectToPopServer, 3000);

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
            if (/\./.test(rawHeader[1])) {
                continue;
            }
            if (rawHeader[3] === "B") {
                returnHeaders[rawHeader[1]] = mimelib.decodeBase64(rawHeader[4], rawHeader[2]);
            } else if (rawHeader[3] === "Q") {
                returnHeaders[rawHeader[1]] = mimelib.decodeQuotedPrintable(rawHeader[4], rawHeader[2]); //quoted-printable 
            } else {
                returnHeaders[rawHeader[1]] = rawHeader[4]; //未编码
            }
        }
    }
    returnHeaders.unread = true;
    returnHeaders.folder = "1";
    messagesList.push(returnHeaders);
}

function parseMessageBody(rawBody) {}


function insertDb(msg) {
    globalDb.open(function(err, db) {
        if (err) {
            console.log("mongodb:" + err);
            return;
        }
        var collection = db.collection("messages");
        collection.insert(msg, function(err, result) {
            if (err) {
                console.log("insert error: " + err);
            }
            globalDb.close();
        });
    });
}

exports.getMessages = function(folder, page, unread, callback) {
    globalDb.open(function(err, db) {
        if (err) {
            console.log("mongodb connect error: " + err);
            return;
        }
        var collection = db.collection("messages"),
            filter = unread ? {folder: folder, unread: true} : {folder: folder};
        
        collection.count(filter, function(err, count) {
            if (err) {
                console.log("mongodb count error: " + err);
                globalDb.close();
                return;
            }
            collection.find(filter, {
                "limit": 2,
                "skip": (page - 1) * 2
            }).toArray(function(err, docs) {
                globalDb.close();
                if (err) {
                    console.log("mongodb find eror: " + err);
                    return;
                }
                callback(docs, count);
            });
        });
    });
}

exports.deleteMail = function(id, callback) {
    globalDb.open(function(err, db) {
        if (err) {
            console.log("mongodb connect error: " + err);
            return;
        }
        var collection = db.collection("messages");
        collection.remove({id: parseInt(id)}, {w: 1}, function(err, numberOfRemovedDocs){
            globalDb.close();
            if (err) {
                console.log("mongodb remove eror: " + err);
                return;
            }
            console.log(id)
            if (typeof(callback) === 'function') {
                callback();
            };
        });
    });
}