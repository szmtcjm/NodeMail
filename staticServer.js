var path = require("path");
var fs = require("fs");
var zlib = require("zlib");
var mine = require("./mime").types;
var config = require("./config");
var url = require("url");

module.exports = function(request, response) {
	var urlParsed = url.parse(request.url, true);
	var pathname = urlParsed.pathname;
	var realPath;
	if (pathname.slice(-1) === "/") {
		pathname = pathname + config.Welcome.file;
	}
	realPath = path.join("static", path.normalize(pathname.replace(/\.\./g, "")));
	fs.stat(realPath, function(err, stat) {
		var lastModify,
			ifModifiedSince = "If-Modified-Since".toLowerCase(),
			raw, acceptEncoding, expires, contentType, ext;
		var stream;
		if (err) {
			response.writeHead(404, "Not Found", {
				'Content-Type': 'text/plain'
			});
			response.write("This request URL " + pathname + " was not found on this server.");
			response.end();
		} else {
			if (stat.isDirectory()) {
				realPath = path.join(realPath, "/", config.Welcome.file);
			}

			ext = path.extname(pathname);
			ext = ext ? ext.slice(1) : "unknown";
			if (ext.match(config.Expires.fileMatch)) {
				expires = new Date();
				expires.setTime(expires.getTime() + config.Expires.maxAge * 1000);
				response.setHeader("Expires", expires.toUTCString());
				response.setHeader("Cache-Control", "max-age=" + config.Expires.maxAge);
			}

			contentType = mine[ext] || "text/plain";
			response.setHeader("Content-Type", contentType);
			//response.setHeader("Content-Length", stat.size)  ---error 压缩

			lastModify = stat.mtime.toUTCString();
			response.setHeader("Last-Modified", lastModify);
			if (request.headers[ifModifiedSince] && lastModify === request.headers[ifModifiedSince]) {
				response.writeHead(304, "Not Modified");
				response.end();
			}

			stream = fs.createReadStream(realPath, {
				end: true
			});
			acceptEncoding = request.headers["accept-encoding"] || "";
			var matched = ext.match(config.Compress.match);
			if (matched && acceptEncoding.match(/\bgzip\b/)) {
				response.writeHead(200, "Ok", {
					"Content-Encoding": "gzip"
				});
				stream = stream.pipe(zlib.createGzip());
			} else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
				response.writeHead(200, "Ok", {
					"Content-Encoding": "deflate"
				});
				stream = stream.pipe(zlib.createDeflate());
			} else {
				response.writeHead(200, "Ok");
				stream.pipe(response);
			}
			stream.pipe(response);
		}
	});
}