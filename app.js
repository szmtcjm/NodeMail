var PORT = 8000;
var http = require("http");
var config = require("./config");
var staticServer = require("./staticServer");
var action = require("./action");
var url = require("url");
var server = http.createServer(function(request, response) {
	var pathname = url.parse(request.url).pathname;
	if (pathname === config.action.getfolder) {
		action.getfolder();
	} else if (pathname === config.action.getmessage) {
		action.getmessage();
	} else {
		staticServer(pathname);
	}
});
server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");

