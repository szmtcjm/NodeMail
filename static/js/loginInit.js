define(function(require, exports, moudle) {
	require("/frontlib/jquery/jquery-2.0.3.min.js");
	var login = require("./login"),
		cookie = require("./cookie");

	$("#submit").click(function(event) {
		$.ajax({
			url: "/login",
			type: "POST",
			//dataType: "json",
			data: {
				user: $("#userName").val(),
				password: $("#passWord").val()
			}
		})
			.done(function(data, textStatus, jqXHR) {
				if (data.success === "ture") {
					cookie.setCookie("user", $("#userName").val(), {
						expires: 10,
					});
					location = "/index.html";
					alert("login success");
				} else {
					alert("login fail");
				}
			});
	});
});