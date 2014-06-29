var express = require('express'),
	router = express.Router();

router.post('/login', function(req, res) {

});

router.post('/register', function(req, res) {

});

router.get('/getFolder', function(req, res) {
	getMessages(req.query, req, res);
});

router.get('/emptyTrash', function(req, res) {
	popemail.emptyTrash(function(num) {
		var statusString = ((num || num === 0) ? 'OK' : 'FAIL');
		res.setHeader("Content-Type", "routerlication/json");
		res.writeHead(200, statusString);
		res.send(JSON.stringify({
			success: statusString,
			deleteNum: num
		}));
	});
});

router.get('/readMail', function(req, res) {
	popemail.readMail(req.query, function() {
		res.setHeader("Content-Type", "routerlication/json");
		res.writeHead(200, 'OK');
		res.send(JSON.stringify({
			success: true,
			body: '1'
		}));
	});
});

router.get('/action/:action', function(req, res) {
	popemail.operateMail(req.query.id, req.params.action, function() {
		getMessages(req.query);
	});
});

router.get('/', function(req, res) {
	if (req.session.user) {
		res.redirect('/pages/index.html');
	} else {
		res.redirect('/pages/login.html');
	}
});

router.use(function(err, req, res, next) {
	// logic
});

function getMessages(query, req, res) {
	popemail.getMessages(query.folder, query.page,
		query.unread, function(docs, count) {
			var responseInfo = {};
			responseInfo.messageCount = count;
			responseInfo.page = query.page;
			responseInfo.pageCount = 15;
			responseInfo.folder = query.folder;
			responseInfo.firstMessage = (query.page - 1) * 15 + 1;
			responseInfo.unreadCount = responseInfo.pageCount;
			responseInfo.messages = docs;
			res.setHeader("Content-Type", "routerlication/json");
			res.writeHead(200, "OK");
			res.send(JSON.stringify(responseInfo));
		});
}

module.exports = router;