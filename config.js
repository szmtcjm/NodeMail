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
	getFolder: 'getFolder',
	readMail: 'readMail',
	deleteMail: 'deleteMail',
	restoreMail: 'restoreMail',
	emptyTrash: 'emptyTrash',
	login: 'login'
}

exports.mailUserName = {
	username: 'szmtcjm',
	password: ""
}