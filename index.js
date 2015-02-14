'use strict';

var gutil     = require('gulp-util'),
    transform = require('stream').Transform;

function gulprsvg(options) {
    options = options || {};
    options.format = options.format || 'png';
    options.scale = options.scale || 1;

    var Rsvg = options.Rsvg || require('librsvg').Rsvg;

    function renderSvg(svg) {
        return new Buffer(svg.render({
            format: options.format,
            width: options.width || svg.width * options.scale,
            height: options.height || svg.height * options.scale
        }).data);
    }

    var stream = new transform({ objectMode: true });

    stream._transform = function(file, unused, done) {
        // Pass through if null
        if (file.isNull()) {
            return done(null, file);
        }
        var svg;

        if (file.isStream()) {
            svg = new Rsvg();
            file.contents.pipe(svg);

            svg.on('finish', function() {
                file.contents = renderSvg(svg);
                done(null, file);
            });
        } else {
            svg = new Rsvg(file.contents);
            file.path = gutil.replaceExtension(file.path, '.' + options.format);
            file.contents = renderSvg(svg);
            done(null, file);
        }
    };

    return stream;
}

module.exports = gulprsvg;
