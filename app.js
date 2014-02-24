var PORT = 8000;
var http = require("http");
var url = require("url");
var config = require("./config");
var staticServer = require("./staticServer");
var action = require("./action");
var popemail = require("./mail");
var login = require("./login");

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
	} else if (pathname.slice(1) === config.action.login) {
		login.verifyUser(userID, function(success) {
			if (success) {
				response.setHeader("Content-Type", "application/json");
				response.writeHead(200, "OK");
				response.end(JSON.stringify({success:true}));
			} else {
				response.setHeader
			}
		});
	} else {
		staticServer(request, response);
	}

	function getMessages(folder, page) {
		popemail.getMessages(folder, page, function(docs){
			var responseInfo = {};
			responseInfo.messageCount = 100;
			responseInfo.page = page;
			responseInfo.pageCount = 10;
			responseInfo.folder = folder;
			responseInfo.firstMessage = (page - 1) * 10 + 1;
			responseInfo.unreadCount = responseInfo.pageCount;
			responseInfo.messages = docs;
			response.setHeader("Content-Type", "application/json");
			response.writeHead(200, "OK");
			response.end(JSON.stringify(responseInfo));
		});
	}

	function getMessageBody(msgNumber) {

	}

});

server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");

