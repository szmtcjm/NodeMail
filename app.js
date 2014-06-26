var PORT = 8001,
	http = require("http"),
	url = require("url"),
	config = require("./config"),
	action = require("./action"),
	//popemail = require("./mail"),
	login = require("./login"),
	express = require("express"),
	app = express(),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	cookieSession = require('cookie-session'),
	MongoStore = require('connect-mongo')(session),
	server;

app.use(morgan());
app.use(cookieParser());
app.use(cookieSession({
	name: 'sess_id',
	keys: 'mail',
	secret: 'mail.session'
	cookie: {
		maxAge: 1000 * 60 * 5
	},
	store: new MongoStore({
		db: 'mail'
	})
}));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'))
app.use(function(err, req, res, next) {
	res.send(500);
});

server = app.listen(PORT, function() {
	console.log('Listening on port %d', PORT);
});