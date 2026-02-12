const { src, dest, watch, series, parallel } = require('gulp');
const connect = require('gulp-connect');
const gulpSass = require('gulp-sass');
const dartSass = require('sass');
const sourcemaps = require('gulp-sourcemaps');
const cleanCss = require('gulp-clean-css');
const terser = require('gulp-terser');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const { deleteAsync } = require('del');

const sass = gulpSass(dartSass);

const paths = {
  html: {
    src: 'src/pages/**/*.html',
    dest: 'dist/'
  },
  styles: {
    src: ['src/styles/**/*.scss', '!src/styles/**/_*.scss'],
    watch: 'src/styles/**/*.scss',
    dest: 'dist/css/'
  },
  scripts: {
    src: ['src/scripts/pages/**/*.js', 'src/scripts/main.js'],
    dest: 'dist/js/'
  },
  assets: {
    src: 'src/assets/**/*',
    dest: 'dist/assets/'
  }
};

function clean() {
  return deleteAsync(['dist']);
}

function html() {
  return src(paths.html.src)
    .pipe(plumber())
    .pipe(dest(paths.html.dest))
    .pipe(connect.reload());
}

function styles() {
  return src(paths.styles.src, { sourcemaps: true })
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(dest(paths.styles.dest))
    .pipe(cleanCss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.styles.dest))
    .pipe(connect.reload());
}

function scripts() {
  return src(paths.scripts.src, { sourcemaps: true })
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(dest(paths.scripts.dest))
    .pipe(terser())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.scripts.dest))
    .pipe(connect.reload());
}

function assets() {
  return src(paths.assets.src)
    .pipe(dest(paths.assets.dest))
    .pipe(connect.reload());
}

function serve(done) {
  connect.server({
    root: 'dist',
    livereload: true,
    host: '127.0.0.1',
    port: 3100
  });

  watch(paths.html.src, html);
  watch(paths.styles.watch, styles);
  watch(paths.scripts.src, scripts);
  watch(paths.assets.src, assets);

  done();
}

const build = series(clean, parallel(html, styles, scripts, assets));
const dev = series(build, serve);

exports.clean = clean;
exports.build = build;
exports.default = dev;
