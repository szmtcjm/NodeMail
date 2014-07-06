var express = require('express'),
	crypto = require('crypto'),
	router = express.Router(),
	crypto = require('crypto'),
	account = require('./models/accounts');

router.post('/login', function(req, res) {
	var md5 = crypto.createHash('md5'),
		password = md5.update(req.body.password).digest('hex');
	account.getOneAccount(req.body.username, function(err, savedaccount) {
		if (err) {
			res.send(500, err);
		} else if ((!savedaccount) || savedaccount.password !== password) {
			res.send({
				success: false,
				message: 'The username is not existed or the password is Incorrect!'
			});
		} else if (savedaccount.password === password) {
			req.session.username = req.body.username;
			res.send({
				success: true
			});
		}
	});
});

router.post('/register', function(req, res) {
	account.getOneAccount(req.body.username, function(err, savedaccount) {
		if (savedaccount.length > 0) {
			res.send({
				success: false,
				msg: 'the username is exists!'
			});
		} else {
			account.save({
				username: req.body.username,
				password: req.body.password
			}, function(err, savedaccount) {
				if (err) {
					res.send(500, err);
				} else {
					req.session.regsuccess = true;
					res.send({
						success: true
					});
				}
			});
		}
	});
});

router.get('/verifyUsername', function(req, res) {
	account.getOneAccount(req.param('username'), function(err, savedaccount) {
		if (err) {
			res.send(500);
		} else {
			res.send({
				existed: savedaccount.length === 0 ? false : true
			});
		}
	});
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

router.get('/regsuccess.html', function(req, res, next) {
	if (!req.session.regsuccess) {
		res.redirect('/login.html');
	} else {
		next();
	}
});

router.get('/', function(req, res) {
	if (req.session.username) {
		res.redirect('/index.html');
	} else {
		res.redirect('/login.html');
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