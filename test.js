/* jshint node: true */
/* global describe, it  */

'use strict';

var convert = require('./index'),
    expect  = require('chai').expect,
    gutil   = require('gulp-util');

var raw = '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="#ff00"/></svg>';

describe('gulp-rsvg', function() {
    it('should convert svg to png', function(cb) {
        var stream = convert();

        stream.on('data', function(file) {
            expect(String(file.contents)).to.not.equal(raw);
            expect(file.path).to.contain.string('png');
            cb();
        });

        stream.write(new gutil.File({
            contents: new Buffer(raw),
            path: 'test.svg'
        }));
    });
    it('should convert svg to pdf', function(cb) {
        var stream = convert({
            format: 'pdf'
        });

        stream.on('data', function(file) {
            expect(String(file.contents)).to.not.equal(raw);
            expect(file.path).to.contain.string('pdf');
            cb();
        });

        stream.write(new gutil.File({
            contents: new Buffer(raw),
            path: 'test.svg'
        }));
    });
});
