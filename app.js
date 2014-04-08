var PORT = 8000,
	http = require("http"),
	url = require("url"),
	config = require("./config"),
	staticServer = require("./staticServer"),
	action = require("./action"),
	popemail = require("./mail"),
	login = require("./login"),
	querystring = require("querystring");
	server = http.createServer(function(request, response) {
		var urlParsed = url.parse(request.url, true),
			pathname = urlParsed.pathname,
			theQueryString = urlParsed.query,
			postData;

		if (pathname.slice(1) === config.action.getFolder) {
			if (theQueryString.folder) {
				console.log(theQueryString.unread);
				getMessages(theQueryString.folder, theQueryString.page, theQueryString.unread);
			}
		} else if (pathname.slice(1) === config.action.getMessageBody) {
			if (theQueryString.msgNumber) {
				getMessageBody(theQueryString.msgNumber);
			}
		} else if (pathname.slice(1) === config.action.listMessages) {
			popemail.listMessages();
		} else if (pathname.slice(1) === config.action.login) {
			postData = "";
			request.on("data", function(postDataChunk) {
				postData += postDataChunk;
			});
			request.on("end", function() {
				login.verifyUser(querystring.parse(postData), function(success) {
					response.setHeader("Content-Type", "application/json");
					response.writeHead(200, "OK");
					response.end(JSON.stringify({
						success: !!success
					}));
				});
			});
		} else {
			staticServer(request, response);
		}

		function getMessages(folder, page, unread) {
			popemail.getMessages(folder, page, unread, function(docs) {
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

	});

server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");