var PORT = 8000,
	http = require("http"),
	url = require("url"),
	config = require("./config"),
	staticServer = require("./staticServer"),
	action = require("./action"),
	popemail = require("./mail"),
	login = require("./login"),
	querystring = require("querystring"),
	server = http.createServer(function(request, response) {
		var urlParsed = url.parse(request.url, true),
			pathname = urlParsed.pathname,
			theQueryString = urlParsed.query,
			postData;

		if (pathname.slice(1) === config.action.getFolder) {
			getMessages(theQueryString);
		} else if (pathname.slice(1) === config.action.getMessageBody) {
			if (theQueryString.msgNumber) {
				getMessageBody(theQueryString.msgNumber);
			}
		} else if (pathname.slice(1) === config.action.deleteMail) {
			deleteMail(theQueryString);
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

		function deleteMail(theQueryString) {
			popemail.deleteMail(theQueryString.id, function() {
				getMessages(theQueryString);
			});
		}

		function getMessages(theQueryString) {
			popemail.getMessages(theQueryString.folder, theQueryString.page, theQueryString.unread, function(docs, count) {
				var responseInfo = {};
				responseInfo.messageCount = count;
				responseInfo.page = theQueryString.page;
				responseInfo.pageCount = 10;
				responseInfo.folder = theQueryString.folder;
				responseInfo.firstMessage = (theQueryString.page - 1) * 10 + 1;
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