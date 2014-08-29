// this is needed to force document.ready on some browsers when using back button
window.onunload = function (){};

// container object for global data
window._jsExtend = {
	$: {}
};

// custom event container
$.createEvent = function (trigger, notifier) {
	if (typeof (_jsExtend.customEvents) == "undefined") {
		_jsExtend.customEvents = [];
	}
	_jsExtend.customEvents[trigger] = notifier;
};

// extend .on() so custom events can be handled
_jsExtend.$.on = $.fn.on;
$.fn.on = function () {
	for (var event in $._customEvents) {
		if (event == arguments[0]) {
			_jsExtend.customEvents[event](this, arguments[1]);
			return this;  // return the element so we can chain as normal
		}
	}
	return _jsExtend.$.on.apply(this, arguments);
};

// Check for console and create empty functions if it doesn't exist
if (typeof console == "undefined") {
	window.console = {
		dir: function () { },
		error: function () { },
		log: function () { },
		warn: function () { }
	};
}

// global debug object
window.debug = {
	get enabled() {
		return localStorage.getItem("_debug") === "true";
	},
	set enabled(value) {
		localStorage.setItem("_debug", value);
	},
	dir: function () {
		if (this.enabled) console.dir.apply(console, arguments);
	},
	error: function () {
		if (this.enabled) console.error.apply(console, arguments);
	},
	log: function () {
		if (this.enabled) console.log.apply(console, arguments);
	},
	warn: function () {
		if (this.enabled) console.warn.apply(console, arguments);
	}
}

// if debugging is enabled, log all ajax requests options
$(document).ajaxSend(function (event, jqXHR, ajaxOptions) {
	if (debug.enabled) {
		console.log(ajaxOptions.url);
		console.log(ajaxOptions);
	}
});

// access query string values by name
function queryString(name) {
	if (typeof (_jsExtend.queryString) == "undefined") {
		_jsExtend.queryString = [];
		var queryString = window.location.search.replace("?", "").split("&");
		for (var i = 0; i < queryString.length; i++) {
			var pair = queryString[i].split("=");
			if (pair.length != 2) continue;
			_jsExtend.queryString[pair[0]] = pair[1];
		}
	}
	return _jsExtend.queryString[name];
}

// Override the jQuery selector with a version that caches all results and does not query the DOM for them again.
// If you use $() then it will cache the results and return them if the same selector and context is used again.
// If you use jQuery() then it uses the original jQuery selector and does not do any caching or look in the cache.
jQuery.noConflict();
$ = function(selector, context, root) {
    if (context === void 0) context = window.document;
    if (window.__jquerySelectorCache === void 0) window.__jquerySelectorCache = {};
    var cachedSelector = selector + "|" + context + "|" + root;
    var cachedResult = window.__jquerySelectorCache[cachedSelector];
    if (cachedResult === void 0) {
        cachedResult = new jQuery.fn.init(selector, context, root);
        window.__jquerySelectorCache[cachedSelector] = cachedResult;
    }
    else {
        console.log("returning cached result");
    }
    return cachedResult;
};
$.fn = $.prototype = jQuery.fn;
jQuery.extend($, jQuery);
