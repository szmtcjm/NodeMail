define(function(require, exports, moudle) {
	require("/frontlib/jquery/jquery-2.0.3.min.js");
	
	exports.getCookie = function(name) {
		var cookies = document.cookie.split(";"),
			i = 0,
			cookie;
		for (; i < cookies.length; i++) {
			cookie = cookies[i].split("=");
			if (cookie[0] === name) {
				return decodeURI(cookie[1]);
			}
		}
		return null;
	};

	exports.setCookie = function(name, value, option) {
		var cookie = name + "=" + encodeURI(value),
		    date;
		option = option || {};
		if (value === null) {
			option.expires = -1;
		}
		if (option.expires) {
			date = new Date();
			date.setTime(date.getTime() + option.expires * 24 * 3600 * 1000);
			cookie += ";expires=" + date.toGMTString();
		}
		cookie += option.domain ? ";domain=" + option.domain : "";
		cookie += option.path ? ";path=" + option.path) : "";
		cookie += option.secure ? ";secure" : "";
		console.log(cookie);
		document.cookie = cookie;
	};
});