;(function(global, factory) {

    "use strict";


    if (typeof define === 'function' && define) {
        define(function() { return factory(global); });
    } else {
        global.pImg = factory(global);
    }

})(this, function(win) {

    var pImg = {
        version: '0.1.1'
    };

    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    var loader = function (imgList, callback, timeout) {

        timeout = timeout || 5000;
        imgList = isArray(imgList) && imgList || [];
        callback = typeof(callback) === 'function' && callback;

        var total = imgList.length,
            loaded = 0,
            imgages = [],
            _on = function () {
                loaded < total && (++loaded, callback && callback(loaded / total));
            };

        if (!total) {
            return callback && callback(1);
        }

        for (var i = 0; i < total; i++) {
            imgages[i] = new Image();
            imgages[i].onload = imgages[i].onerror = _on;
            imgages[i].src = imgList[i];
        }

        setTimeout(function () {
            loaded < total && (loaded = total, callback && callback(loaded / total));
        }, timeout * total);

    };

    var imgLoader = function (callback) {

        var imgList = document.querySelectorAll('img');

        for (var i = 0; i < imgList.length; i++) {

            var src = imgList[i].getAttribute('_src');

            if (src) {
                imgList[i].setAttribute('src', src);
            }

        }

        callback && callback();

    };


    pImg.loader = loader;
    pImg.replace = imgLoader;

    return pImg;

});