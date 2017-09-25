'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
 //for w3c css validation
var validate = require('gulp-w3c-css');
var path = require('path');
var gutil = require('gulp-util');
var srcPath = path.join(__dirname, './assets/css/**/*.css');
var dstPath = path.join(__dirname, '././assets/css/');
var errPath = path.join(__dirname, '././asset/error');
var prodPath = path.join(__dirname, '././asset/prod');
//for htmlhint
var htmlhint = require("gulp-htmlhint");
// for babel
const babel = require('gulp-babel');

//for beautify
var beautify = require('gulp-beautify');
//for gulp uglify
var uglify = require('gulp-uglify');
var pump = require('pump');
//for gulp htmlmin
var htmlmin = require('gulp-htmlmin');
//for gulp cleanCSS
let cleanCSS = require('gulp-clean-css');



//gulp task for css
gulp.task('w3scss', function() {
    return gulp.src(srcPath)
    .pipe(validate())
    .pipe(gulp.dest(errPath));
});  

//gulp task for html validation
gulp.task('htmlhint', function() {
    return gulp.src("./*.html")
    .pipe(htmlhint())
    .pipe(gulp.dest(errPath))
});
//for sass compiling    

gulp.task('sass', function() {
  return gulp.src('./assets/sass/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./assets/css/'));
});
// gulp task for babel
gulp.task('babel', () =>
    gulp.src('assets/js/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest(prodPath))
);
// gulp task for watching sass
gulp.task('watch', function () {
  gulp.watch('./assets/sass/**/*.scss', ['sass']);
});

//for beautify
gulp.task('beautify', function() {
  gulp.src('./assets/js/*.js')
    .pipe(beautify({indent_size: 2}))
    .pipe(gulp.dest('./assets/js'))
});
//js minifier
gulp.task('compress', function (cb) {
  pump([
        gulp.src('assets/js/*.js'),
        uglify(),
        gulp.dest(prodPath)
    ],
    cb
  );
});
//html minifier
gulp.task('minify', function() {
  return gulp.src('./*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(prodPath));
});
//css minifier
gulp.task('minify-css', () => {
  return gulp.src('assets/css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(prodPath));
});

gulp.task('cssTasks',['sass','w3scss']);
gulp.task('htmlTasks',['htmlhint']);
gulp.task('jsTasks',['babel','beautify']);
gulp.task('prodReady', ['compress','minify','minify-css']);

gulp.task('default', ['cssTasks', 'htmlTasks','jsTasks']);