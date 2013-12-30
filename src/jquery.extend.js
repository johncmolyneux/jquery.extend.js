// custom event container
$.fn._customEvents = {};
$.fn.createEvent = function (trigger, notifier) {
    $.fn._customEvents[trigger] = notifier;
};

// extend .on() so custom events can be handled
$.fn._on = $.fn.on;
$.fn.on = function () {
    for (var event in $.fn._customEvents) {
        if (event == arguments[0]) {
            $.fn._customEvents[event](this, arguments[1]);
            return this;  // return the element so we can chain as normal
        }
    }
    return $.fn._on.apply(this, arguments);
};

// custom events -------------------------------------------------------------------------------------

// fires when child images are loaded within a selected element
$.fn.createEvent("imagesloaded", function (element, callback) {
    var $element = $(element);
    var $images = $element.find("img");
    var imgCount = $images.length;
    if (!imgCount) {
        callback();
    } else {
        $images.each(function () {
            $(this).one("load error", function () {
                imgCount--;
                if (imgCount == 0) {
                    callback();
                }
            });
            if (this.complete) $(this).load();
        });
    }
});

// fires when the enter key is pressed within a selected element (must accept keyup)
$.fn.createEvent("enter", function (element, callback) {
    var $element = $(element);
    $element.on("keyup", function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) {
            callback();
        }
    });    
})
