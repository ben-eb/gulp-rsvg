/* jshint node: true */

'use strict';

var Rsvg          = require('rsvg').Rsvg,
    gutil         = require('gulp-util'),
    transform     = require('stream').Transform,

    PLUGIN_NAME   = 'gulp-rsvg';

function gulprsvg(options) {
    options = options || {};
    options.format = options.format || 'png';
    options.scale = options.scale || 1;

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

        if (file.isStream()) {
            var svg = new Rsvg();
            file.contents.pipe(svg);

            svg.on('finish', function() {
                file.contents = renderSvg(svg);
                done(null, file);
            });
        } else {
            var svg = new Rsvg(file.contents);
            file.path = gutil.replaceExtension(file.path, '.' + options.format);
            file.contents = renderSvg(svg);
            done(null, file);
        }
    };

    return stream;
}

module.exports = gulprsvg;
