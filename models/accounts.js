var Schemas = require('./schemas.js'),
	crypto = require('crypto'),
	AccountSchema = Schemas.AccountSchema,
	AccountModel = mongoose.model('accountModel', AccountSchema)

exports.save = function(account, callback) {
	var md5 = crypto.createHash('md5'),
		password = md5.update(account.password).digest('hex'),
		accoutIns = new AccountModel({
			username: account.username,
			password: password
		});

	accoutIns.save(function(err) {
		callback(err);
	});
};

exports.getOneAccount = function(username) {
	AccountModel.find({
		username: username
	}, function(err, account) {

	});
};