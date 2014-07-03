var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/Mail');

var AccountSchema = new Schema({
	username: String,
	password: String
});

AccountModel = mongoose.model('accountModel', AccountSchema);
exports.AccountModel = AccountModel;