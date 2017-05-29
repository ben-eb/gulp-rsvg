# [gulp][gulp]-rsvg [![Build Status](https://travis-ci.org/ben-eb/gulp-rsvg.svg?branch=master)][ci] [![NPM version](https://badge.fury.io/js/gulp-rsvg.svg)][npm] [![Dependency Status](https://gemnasium.com/ben-eb/gulp-rsvg.svg)][deps]

> Convert SVG to PNG or PDF.

*If you have any difficulties with the output of this plugin, please use the
[RSVG tracker](https://github.com/2gis/node-rsvg/issues).*

## Install

With [npm](https://npmjs.org/package/gulp-rsvg) do:

```
npm install gulp-rsvg --save-dev
```

Note that this plugin wraps [node-rsvg](https://github.com/2gis/node-rsvg) and
so requires LibRSVG to be available on the command line. Please see the README
for *node-rsvg* for a guide on how to set that up for your platform.

## Example

```js
var gulp = require('gulp');
var convert = require('gulp-rsvg');

gulp.task('png', function () {
    return gulp.src('logo.svg')
        .pipe(convert())
        .pipe(gulp.dest('./out'));
});

gulp.task('pdf', function () {
    return gulp.src('logo.svg')
        .pipe(convert({
            format: 'pdf'
        }))
        .pipe(gulp.dest('./out'));
});
```

## API

### format
Type: `String`
Default value: `png`

The format to convert to. Accepts `png` or `pdf`.

### width
Type: `Integer`
Default value: `undefined`

Specify a new width for the resulting file. Defaults to the width of the SVG.

### height
Type: `Integer`
Default value: `undefined`

Specify a new height for the resulting file. Defaults to the height of the SVG.

### scale
Type: `Integer`
Default value: 1

Scale the generated file by this factor. Useful for retina assets.

### Rsvg
Type: `Function`
Default value: `require('librsvg').Rsvg`

Pass a svg rendering library. `Rsvg` by npm package `librsvg` used by default.

## Contributing

Pull requests are welcome. If you add functionality, then please add unit tests
to cover it.

## License

MIT © [Ben Briggs](http://beneb.info)

[ci]:   https://travis-ci.org/ben-eb/gulp-rsvg
[deps]: https://gemnasium.com/ben-eb/gulp-rsvg
[gulp]: https://github.com/wearefractal/gulp
[npm]:  http://badge.fury.io/js/gulp-rsvg
