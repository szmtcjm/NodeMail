define(function(require, exports, moudle) {
	require("/frontlib/jquery/jquery-2.0.3.min.js");

	$("#submit").click(function(event) {
		$.ajax({
			url: "/login",
			type: "POST",
			dataType: "json",
			data: { user: $("#userName").val(), password: $("#passWord").val }
		})
		.done(function(data, textStatus, jqXHR) {
			if (data.success) {
				alert("login success");
			} else if (data.success) {
				alert("login fail");
			}
		});
	});

});