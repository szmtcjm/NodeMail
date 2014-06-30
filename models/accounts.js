var Db = require('./db');

exports.save = function() {
	Db.open(function(err, db) {
		if (err) {

		}
		db.collection('accounts', function(err, collection) {
			collection.insert();
		});
	});
};

exports.getOneAccount = function(username) {
	Db.open(function(err, db) {
		db.collection('accounts', function(err, collection) {
			collection.findOne({
				username: username
			});
		});
	});
};