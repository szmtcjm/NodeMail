var POP3Client = require("node-poplib");
var pop3client = new POP3Client(port, host, {
	tlserrs: false,
	enabletls: true,
	debug: false
});

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
        pop3client.list();

    } else {

        console.log("LOGIN/PASS failed");
        pop3client.quit();

    }
});

pop3client.on("list", function(status, msgcount, msgnumber, data, rawdata) {

    if (status === false) {

        console.log("LIST failed");
        pop3client.quit();

    } else {

        console.log("LIST success with " + msgcount + " element(s)");

        if (msgcount > 0)
            pop3client.retr(1);
        else
            pop3client.quit();

    }
});

exports.getMessages = function() {

}