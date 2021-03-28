const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const notify = require("gulp-notify");

const pug = require('gulp-pug');
const beautify = require('gulp-beautify');

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');

const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;

const eslint = require('gulp-eslint');
const { results } = require('gulp-eslint');

function browser(){
    browserSync.init({
        server: {baseDir: 'build/'},
        notify: false,
        online: true
    })
}

function html(){
    return src([
        'src/pages/*.pug'
    ])
    .pipe(pug({
        pretty: true
    }))
    .pipe(beautify.html({
        indent_size: 4
    }))
    .pipe(dest('build'))
    .pipe(browserSync.stream())
}

function style(){
    return src([
        'src/sass/*.sass'
    ])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(concat('style.css'))
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 10 versions'],
        grid: true
    }))
    .pipe(cleancss({ level: { 1: { specialComments: 0 } }, format: 'beautify'}))
    .pipe(sourcemaps.write())
    .pipe(dest('build/css'))
    .pipe(browserSync.stream())
}

function js(){
    return src([
        'node_modules/jquery/dist/jquery.min.js',
        'src/js/*.js' //все файлы JS в src/js
    ])
    .pipe(sourcemaps.init())
    .pipe(eslint({
        fix: true
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .on("error", notify.onError(function () {
        return "Обнаружены ошибки в JavaScript. Проверьте консоль";
      }))
    .pipe(concat('app.js')) //слитие в один файл
    .pipe(uglify()) //сжатие
    .pipe(sourcemaps.write())
    .pipe(dest('build/js')) //помещение результата в build/js
    .pipe(browserSync.stream()) //обновление браузера
}

function jslinter(){
    return src([
        'src/js/*.js' //все файлы JS в src/js
    ])
    .pipe(eslint({
        fix: true
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(dest('src/js'))
}

function watcher(){
    watch('src/**/*.pug', html);
    watch('src/sass/*.sass', style);
    watch('src/js/*.js', js);
}

// Exports
exports.browser = browser;
exports.html = html;
exports.style = style;
exports.js = js;
exports.jslinter = jslinter;

exports.default = series(parallel(html, style, js), parallel(browser, watcher));