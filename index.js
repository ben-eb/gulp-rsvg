'use strict';

var gutil     = require('gulp-util'),
    assign    = require('object-assign'),
    transform = require('stream').Transform;

module.exports = function gulprsvg (options) {
    options = assign({
        format: 'png',
        scale: 1,
        Rsvg: require('librsvg').Rsvg
    }, options);

    var Rsvg = options.Rsvg;

    function renderSvg (svg) {
        return new Buffer(svg.render({
            format: options.format,
            width: options.width || svg.width * options.scale,
            height: options.height || svg.height * options.scale
        }).data);
    }

    var stream = new transform({objectMode: true});

    stream._transform = function (file, encoding, cb) {
        // Pass through if null
        if (file.isNull()) {
            return cb(null, file);
        }
        var svg;

        if (file.isStream()) {
            svg = new Rsvg();
            file.contents.pipe(svg);

            svg.on('finish', function () {
                file.contents = renderSvg(svg);
                cb(null, file);
            });
        } else {
            svg = new Rsvg(file.contents);
            file.path = gutil.replaceExtension(file.path, '.' + options.format);
            file.contents = renderSvg(svg);
            cb(null, file);
        }
    };

    return stream;
};
