/* jshint node: true */

'use strict';

var Rsvg          = require('rsvg').Rsvg,
    gutil         = require('gulp-util'),
    transform     = require('stream').Transform,
    bufferstreams = require('bufferstreams'),

    PLUGIN_NAME   = 'gulp-rsvg';

function rsvgTransform(options) {
    // Returns a callback that handles the buffered content
    return function(err, buffer, cb) {
        if (err) {
            cb(gutil.PluginError(PLUGIN_NAME, err));
        }
        var svg = new Rsvg(String(buffer));
        var transform = svg.render({
            format: options.format,
            width: options.width || svg.width,
            height: options.height || svg.height
        }).data;
        cb(null, new Buffer(transform));
    };
}

function gulprsvg() {
    var options = {
        format: 'png'
    };
    if (arguments.length > 0) {
        options.format = arguments[0].format || options.format;
        options.width = arguments[0].width || false;
        options.height = arguments[0].height || false;
    }
    var stream = new transform({ objectMode: true });

    stream._transform = function(file, unused, done) {
        // Pass through if null
        if (file.isNull()) {
            stream.push(file);
            done();
            return;
        }

        if (file.isStream()) {
            file.contents = file.contents.pipe(new bufferstreams(rsvgTransform(options)));
            stream.push(file);
            done();
        } else {
            var svg = new Rsvg(file.contents);
            file.path = gutil.replaceExtension(file.path, '.' + options.format);
            file.contents = new Buffer(svg.render({
                format: options.format,
                width: options.width || svg.width,
                height: options.height || svg.height
            }).data);
            stream.push(file);
            done();
        }
    };

    return stream;
}

gulprsvg.rsvgTransform = rsvgTransform;
module.exports = gulprsvg;
