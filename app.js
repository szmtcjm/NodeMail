var PORT = 8000;
var http = require("http");
var url = require("url");
var queryString = require("queryString");
var config = require("./config");
var staticServer = require("./staticServer");
var action = require("./action");
var pop3client = require("./mail");

var server = http.createServer(function(request, response) {
	var urlParsed = url.parse(request.url, true);
	var pathname = urlParsed.pathname;
	var theQueryString = queryString.parse(urlParsed.queryString);
	if (pathname === config.action.getfolder) {
		if (theQueryString.foldNumber) {
			getfolder(foldNumber);
		}
	} else if (pathname === config.action.getMessageBody) {
		if (theQueryString.msgNumber) {
			getMessageBody(theQueryString.msgNumber);
		}
	} else if (pathname === config.action.listMessages) {
		POP3Client.listMessages();
	} else {
		staticServer(pathname);
	}

	function getfolder(foldNumber) {
		response.setHeader("Content-Type", "application/json");
		response.writeHead(200, "Ok");
		response.end(pop3client.messagesList.slice((foldNumber - 1) * 10 + 1, foldNumber * 10));
	}

	function getMessageBody(msgNumber) {

	}

});



server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");

