var gulp = require('gulp');
var postcss = require('gulp-postcss')
var cssnext = require('postcss-cssnext')
var sourcemaps = require('gulp-sourcemaps');
var atImport = require("postcss-import");
var nested = require('postcss-nested');
var apply = require('postcss-apply');
var stylefmt = require('stylefmt');

var AUTOPREFIXER_BROWSERS = [
  'last 2 version',
  'ie >= 9',
  'iOS >= 7',
  'Android >= 4.0'
];

var src = {
  'css': ['src/**/*.css', '!' + 'src/**/_*.css']
}

var dest = {
  'css': './dest'
}

gulp.task('css', function() {
  var plugins = [
    atImport,
    apply,
    nested,
    cssnext({
      browsers: AUTOPREFIXER_BROWSERS
      }),
    stylefmt
  ];
  return gulp.src(src.css)
  .pipe(sourcemaps.init())
  .pipe(postcss(plugins))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(dest.css));
});
