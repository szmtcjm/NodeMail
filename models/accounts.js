var Schemas = require('./schemas.js'),
	crypto = require('crypto'),
	AccountModel = Schemas.AccountModel;

exports.save = function(account, callback) {
	var md5 = crypto.createHash('md5'),
		password = md5.update(account.password).digest('hex'),
		accoutIns = new AccountModel({
			username: account.username,
			password: password
		});
	accoutIns.save(function(err) {
		callback(err, account);
	});
};

exports.getOneAccount = function(username, callback) {
	AccountModel.findOne({
		username: username
	}, function(err, account) {
		callback(err, account);
	});
};