'use strict';

var convert = require('./index'),
    test    = require('tape'),
    Stream  = require('stream'),
    fs      = require('fs'),
    gutil   = require('gulp-util');

var raw = fs.readFileSync('./fixture.svg', 'utf-8');

function fixture (contents) {
    return new gutil.File({
        contents: contents,
        cwd: __dirname,
        base: __dirname,
        path: __dirname + '/fixture.svg'
    });
}

test('should convert svg to png', function (t) {
    t.plan(2);

    var stream = convert();

    stream.on('data', function (file) {
        t.notEqual(String(file.contents), raw);
        t.ok(~file.path.indexOf('png'), 'should be a png');
    });

    stream.write(fixture(new Buffer(raw)));
});

test('should convert svg to pdf', function (t) {
    t.plan(2);

    var stream = convert({format: 'pdf'});

    stream.on('data', function (file) {
        t.notEqual(String(file.contents), raw);
        t.ok(~file.path.indexOf('pdf'), 'should be a pdf');
    });

    stream.write(fixture(new Buffer(raw)));
});

test('should work the same with streams', function (t) {
    t.plan(1);

    var stream = convert();
    var fakeFile = fixture(new Stream.PassThrough());

    stream.on('data', function (data) {
        t.notEqual(String(data.contents), raw);
    });

    stream.write(fakeFile);
    fakeFile.contents.write(raw);
    fakeFile.contents.end();
});

test('should let null files pass through', function (t) {
    t.plan(1);

    var stream = convert();

    stream.on('data', function (data) {
        t.equal(data.contents, null, 'should not transform null in any way');
    });

    var file = fixture(null);

    stream.write(file);
});
