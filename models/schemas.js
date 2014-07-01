var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/Mail');

var accountSchema = new Schema({
	username: String,
	password: String
});
exports.AccountSchema = AccountSchema;