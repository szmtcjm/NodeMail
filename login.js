var Server = require('mongodb').Server;
var Db = require('mongodb').Db;
var globalDb = new Db('Mail', new Server('127.0.0.1', 27017), {safe:false});

exports.verifyUser = function(userInfo, callback) {
	globalDb.open(function(err, db) {
		if (err) {
            console.log("mongodb:" + err);
            return;
        }
        var collection = db.collection("users");
        collection.findOne({user:userInfo.user}, function(err, doc) {
            console.log(userInfo.user)
        	var result;
            if (err) {
                result = false;
        		console.log(err);
        	} else {
                console.log(doc)
                if (doc && doc.password === userInfo.password) {
                    result = true;
                } else {
                    result = false;
                }
        	}
            callback(result);
            globalDb.close();
        });
	});
};
