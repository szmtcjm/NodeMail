var Db = require('mongodb').Db,
	Server = require('mongodb').Server;

module.exports = new Db('Mail', new Server('localhost', 27017), {
	safe: true
});