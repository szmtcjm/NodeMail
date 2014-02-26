var Server = require('mongodb').Server;
var Db = require('mongodb').Db;
var globalDb = new Db('users', new Server('127.0.0.1', 27017), {safe:false});

exports.verifyUser = function(userID, callback) {
	globalDb.open(function(err, db) {
		if (err) {
            console.log("mongodb:" + err);
            return;
        }
        var collection = db.collection("users");
        collection.findOne({user:userID}, function(err, doc) {
        	if (err) {
        		console.log(err);
        		callback(false);
        	} else {
        		callback(true);
        	}
            globalDb.close();
        });
	});
};
