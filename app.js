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
			postData,
			route = pathname.slice(1);

		if (route === config.action.getFolder) {
			getMessages(theQueryString);
		} else if (route === config.action.emptyTrash) {
			console.log(config.action.emptyTrash);
			popemail.emptyTrash(function(num) {
				var statusString = ((num || num === 0) ? 'OK' : 'FAIL');
				response.setHeader("Content-Type", "application/json");
				response.writeHead(200, statusString);
				response.end(JSON.stringify({success: statusString, deleteNum: num}));
			});
		} else if (route === config.action.readMail) {
			if (theQueryString.id) {
				popemail.readMail(theQueryString, function() {
					response.setHeader("Content-Type", "application/json");
					response.writeHead(200, 'OK');
					response.end(JSON.stringify({success: true, body: '1'}));
				});
			}
		} else if (route === config.action.deleteMail || route === config.action.restoreMail) {
			operateMail(theQueryString, route);
		} else if (route === config.action.login) {
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

		function operateMail(theQueryString, action) {
			popemail.operateMail(theQueryString.id, action, function() {
				getMessages(theQueryString);
			});
		}

		function getMessages(theQueryString) {
			popemail.getMessages(theQueryString.folder, theQueryString.page, theQueryString.unread, function(docs, count) {
				var responseInfo = {};
				responseInfo.messageCount = count;
				responseInfo.page = theQueryString.page;
				responseInfo.pageCount = 15;
				responseInfo.folder = theQueryString.folder;
				responseInfo.firstMessage = (theQueryString.page - 1) * 15 + 1;
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