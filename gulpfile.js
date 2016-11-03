var gulp = require('gulp');
// CSS
var postcss = require('gulp-postcss')
var cssnext = require('postcss-cssnext')
var atImport = require("postcss-import");
var stylefmt = require('stylefmt');
// iconfont
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');
// Utility
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var rimraf = require('rimraf');

var AUTOPREFIXER_BROWSERS = [
  'last 2 version',
  'ie >= 9',
  'iOS >= 7',
  'Android >= 4.0'
];

var src = {
  'css': ['src/css/**/*.css', '!src/css/**/_*.css'],
  'cssWatch': 'src/css/**/*.css',
  'iconfont': 'src/icon/**/*.svg'
}

var dest = {
  'css': './dest',
  'iconfont': 'dest/font/'
}

gulp.task('css', function() {
  var plugins = [
    atImport,
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

/**
 * SVGからアイコンフォントを生成します。
 * アイコンフォント用のCSSファイルとHTMLファイルも生成します。
 */
gulp.task('iconfont', function() {
  // シンボルフォント名を指定します。
  var fontName = 'iconfont';
  return gulp.src(src.iconfont)
  .pipe(iconfont({
    fontName: fontName,
    formats: ['ttf', 'eot', 'woff', 'svg'],
    // SVGファイル名にUnicodeを付与します（recommended option）。
    prependUnicode: true
  }))
  .on('glyphs', function(codepoints, opt) {
    var options = {
      glyphs: codepoints,
      fontName: fontName,
      // CSSファイルからfontファイルまでの相対パスを指定します。
      fontPath: '../font/',
      // CSSのクラス名を指定します。
      className: 'p-icon'
    };
    // CSSのテンプレートからCSSファイルを生成します。
    gulp.src('src/icon/template/_icon.css')
    .pipe(consolidate('lodash', options))
    .pipe(rename({
      // 出力するCSSファイルをリネームします。
      basename: '_icon'
    }))
    .pipe(gulp.dest('src/css/parts/'));
    // アイコンフォントのサンプルHTMLを生成します。
    gulp.src('src/icon/template/_icon.html')
    .pipe(consolidate('lodash', options))
    .pipe(rename({
      basename: 'iconfont'
    }))
    // アイコンフォントのサンプルHTMLを生成するパスを指定します。
    .pipe(gulp.dest('dest/iconfont/'))
  })
  // fontファイルを出力するパスを指定します。
  .pipe(gulp.dest(dest.iconfont));
});

gulp.task('cleanDest', function (cb) {
  rimraf('dest/', cb);
});

gulp.task('watch', ['iconfont', 'css'], function() {
  gulp.watch(src.cssWatch, ['css']);
  gulp.watch(src.iconfont, ['iconfont']);
});
