exports.Expires = {
    fileMatch: /^(gif|png|jpg|js|css)$/ig,
    maxAge: 60 * 60 * 24 * 365
};
exports.Compress = {
	match: /css|js|html/ig
};
exports.Welcome = {
	file: "index.html"
};
exports.action = {
	getFolder: "getFolder",
	getmessage: "getMessageBody"
}

exports.mailUserName = {
	username: "szmtcjm",
	password: ""
}