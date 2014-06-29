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
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session),
	router = require('./router.js'),
	server;

app.set('port', process.env.PORT || 8001);
app.use(morgan('dev')); //log
app.use(cookieParser());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(session({
	keys: 'mail',
	secret: 'mail.session',
	cookie: {
		maxAge: 1000 * 60 * 5
	},
	store: new MongoStore({
		db: 'Mail'
	})
}));

app.use(express.static(__dirname + '/public'));
app.use(router);
app.use(function(err, req, res, next) {
	res.send(500);
});
server = app.listen(PORT, function() {
	console.log('Listening on port %d', PORT);
});