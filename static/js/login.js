define(function(require, exports, moudle) {
	require("/frontlib/jquery/jquery-2.0.3.min.js");
	var cookie = require("./cookie");

	exports.checkLogin = function() {
		var user = cookie.getCookie("user");
		if (user) {
			$("#divUser").text(user);
		} else {
			location = "/login.html";
		}
	};
});