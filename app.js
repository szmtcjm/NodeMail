var PORT = 8000;
var http = require("http");
var url = require("url");
var config = require("./config");
var staticServer = require("./staticServer");
var action = require("./action");
var popemail = require("./mail");

var server = http.createServer(function(request, response) {
	var urlParsed = url.parse(request.url, true);
	var pathname = urlParsed.pathname;
	var theQueryString = urlParsed.query;
	if (pathname.slice(1) === config.action.getFolder) {
		if (theQueryString.folder) {
			getMessages(theQueryString.folder, theQueryString.page);
		}
	} else if (pathname.slice(1) === config.action.getMessageBody) {
		if (theQueryString.msgNumber) {
			getMessageBody(theQueryString.msgNumber);
		}
	} else if (pathname.slice(1) === config.action.listMessages) {
		popemail.listMessages();
	} else {
		staticServer(request, response);
	}

	function getMessages(fold, page) {
		popemail.checkMail();
		popemail.on("end", function() {
			response.setHeader("Content-Type", "application/json");
			response.writeHead(200, "Ok");
			response.end(JSON.stringify(popemail.messagesList.slice((page - 1) * 10 + 1, page * 10)));
		});
	}

	function getMessageBody(msgNumber) {

	}

});



server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");

