/* jshint node: true */
/* global describe, it  */

'use strict';

var convert = require('./index'),
    expect  = require('chai').expect,
    Stream  = require('stream'),
    es      = require('event-stream'),
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
    it('should work the same in stream mode', function(cb) {
        var stream = convert();
        var fakeFile = new gutil.File({
            contents: new Stream()
        });

        stream.on('data', function(data) {
            data.contents.pipe(es.wait(function(err, data) {
                expect(data).to.not.equal(raw);
                cb();
            }));
        });

        stream.write(fakeFile);
        fakeFile.contents.write(raw);
        fakeFile.contents.end();
    });
    it('should let null files pass through', function(cb) {
        var stream = convert(),
            n = 0;

        stream.pipe(es.through(function(file) {
            expect(file.path).to.equal('null.md');
            expect(file.contents).to.equal(null);
            n++;
        }, function() {
            expect(n).to.equal(1);
            cb();
        }));

        stream.write(new gutil.File({
            path: 'null.md',
            contents: null
        }));
        stream.end();
  });
});
