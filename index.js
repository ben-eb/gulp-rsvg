/* jshint node: true */

'use strict';

var gutil = require('gulp-util'),
    Rsvg  = require('rsvg').Rsvg,
    map   = require('map-stream');

module.exports = function() {
    var format = 'png';
    if (arguments.length > 0) {
        format = arguments[0].format || format;
        var width = arguments[0].width || false;
        var height = arguments[0].height || false;
    }
    return map(function(file, cb) {
        var svg = new Rsvg(file.contents);
        file.path = gutil.replaceExtension(file.path, '.' + format);
        file.contents = new Buffer(svg.render({
            format: format,
            width: width || svg.width,
            height: height || svg.height
        }).data);
        cb(null, file);
    });
};
