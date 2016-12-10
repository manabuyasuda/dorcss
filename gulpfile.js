var gulp = require('gulp');
// HTML
var pug = require('gulp-pug');
var fs = require('fs');
var data = require('gulp-data');
var path = require('path');

// CSS
var postcss = require('gulp-postcss');
var cssnext = require('postcss-cssnext');
var atImport = require('postcss-import');
var stylefmt = require('stylefmt');

// iconfont
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');

// Styleguide
var aigis = require('gulp-aigis');

// Utility
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");
var rename = require('gulp-rename');
var rimraf = require('rimraf');

var AUTOPREFIXER_BROWSERS = [
  'last 2 version',
  'ie >= 9',
  'iOS >= 7',
  'Android >= 4.0'
];

var src = {
  'html': ['src/**/*.pug', '!' + 'src/**/_*.pug'],
  'json': 'src/_data/',
  'css': ['src/assets/css/**/*.css', '!src/assets/css/**/_*.css'],
  'cssWatch': 'src/assets/css/**/*.css',
  'js': 'src/**/*.js',
  'image': ['src/**/*.{png,jpg,gif,svg}', '!' + 'src/assets/icon/*.svg', '!' + 'src/assets/font/*.svg'],
  'iconfont': 'src/assets/icon/**/*.svg'
};

var dest = {
  'root': 'dest/',
  'html': 'dest/',
  'css': 'dest/assets/css/',
  'iconfont': 'dest/assets/font/'
};

/**
 * `.pug`をコンパイルしてから、releaseディレクトリに出力します。
 * JSONの読み込み、ルート相対パス、Pugの整形に対応しています。
 */
gulp.task('html', function() {
  // JSONファイルの読み込み。
  var locals = {
    'site': JSON.parse(fs.readFileSync(src.json + 'site.json')),
    'data': JSON.parse(fs.readFileSync(src.json + 'data.json'))
  }
  return gulp.src(src.html)
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(data(function(file) {
    // 各ページごとの`/`を除いたルート相対パスを取得します。
    locals.relativePath = path.relative(file.base, file.path.replace(/.pug$/, '.html'));
      return locals;
  }))
  .pipe(pug({
    // JSONファイルをPugに渡します。
    locals: locals,
    // Pugファイルのルートディレクトリを指定します。
    // `/assets/pug/_layout`のようにルート相対パスを使います。
    basedir: 'src',
    // Pugファイルの整形。
    pretty: true
  }))
  .pipe(gulp.dest(dest.html))
  .pipe(browserSync.reload({stream: true}));
});

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
  .pipe(gulp.dest(dest.css))
  .pipe(browserSync.reload({stream: true}));
});

/**
 * デフォルトjsファイルとjQueryをreleaseディレクトリに出力します。
 */
gulp.task('js', function() {
  return gulp.src(src.js, {base: src.root})
  .pipe(gulp.dest(dest.root))
  .pipe(browserSync.reload({stream: true}));
});

/**
 * developディレクトリの画像を階層構造を維持したまま、releaseディレクトリに出力します。
 */
gulp.task('image', function() {
  return gulp.src(src.image)
  .pipe(gulp.dest(dest.root))
  .pipe(browserSync.reload({stream: true}));
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
      className: 'c-icon'
    };
    // CSSのテンプレートからCSSファイルを生成します。
    gulp.src('src/assets/icon/template/_icon.css')
    .pipe(consolidate('lodash', options))
    .pipe(rename({
      // 出力するCSSファイルをリネームします。
      basename: '_icon'
    }))
    .pipe(gulp.dest('src/assets/css/component/'));
    // アイコンフォントのサンプルHTMLを生成します。
    gulp.src('src/assets/icon/template/_icon.html')
    .pipe(consolidate('lodash', options))
    .pipe(rename({
      basename: 'iconfont'
    }))
    // アイコンフォントのサンプルHTMLを生成するパスを指定します。
    .pipe(gulp.dest('dest/assets/iconfont/'))
  })
  // fontファイルを出力するパスを指定します。
  .pipe(gulp.dest(dest.iconfont));
});

/**
 * スタイルガイドを生成します。
 */
gulp.task('styleguide', function() {
  return gulp.src('./aigis/aigis_config.yml')
    .pipe(aigis());
});

gulp.task('cleanDest', function (cb) {
  rimraf('dest/', cb);
});

/**
 * 一連のタスクを処理します（画像の圧縮は`gulp public`タスクでおこないます）。
 */
gulp.task('build', ['iconfont'], function() {
  runSequence(
    ['html', 'css', 'styleguide', 'js', 'image']
    )
});

gulp.task('watch', ['build'], function() {
  gulp.watch(src.html, ['html']);
  gulp.watch(src.cssWatch, ['css']);
  gulp.watch(src.cssWatch, ['styleguide']);
  gulp.watch(src.js, ['js']);
  gulp.watch(src.image, ['image']);
  gulp.watch(src.iconfont, ['iconfont']);
});

/**
 * ローカルサーバーを起動します。
 */
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: dest.root,
      index: "index.html"
    }
  });
});

/**
 * 開発に使用するタスクです。
 * `gulp`タスクにbrowser-syncを追加します。
 * ローカルサーバーを起動し、リアルタイムに更新を反映させます。
 */
gulp.task('default', ['cleanDest'], function() {
  runSequence(
    'watch',
    'browser-sync'
  )
});
