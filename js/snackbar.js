window.Snackbar = function(options) {
	var defaults = {
		text: 'Saved',
		type: 'success',
		delay: snackbarDelay
	};
	options = $.extend(defaults, options);

	var x = document.getElementById("snackbar");
	x.className = "show " + "snackbar-" + options.type;
	x.innerText = options.text;
	setTimeout(function() { x.className = x.className.replace("show", ""); }, options.delay);
	// $('#snackbar').addClass("snackbar-" + options.type).html(options.text).show().delay(options.delay).fadeOut();
}
