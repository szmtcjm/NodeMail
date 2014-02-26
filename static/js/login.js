define(function(require, exports, moudle) {
	require("/frontlib/jquery/jquery-2.0.3.min.js");
	var cookie = require("./cookie");

	exports.checkLogin = function() {
		if (cookie.getCookie("user")) {
			alert("logined");
		} else {
			location = "/login.html";
		}
	};
});