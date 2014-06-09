
var gulp              = require('gulp'),
    gulp_util         = require('gulp-util'),
    gulp_rename       = require('gulp-rename'),
    gulp_uglify       = require('gulp-uglify'),
    gulp_svgmin       = require('gulp-svgmin'),
    gulp_sass         = require('gulp-sass'),
    // gulp_sass         = require('gulp-compass'),
    gulp_imagemin     = require('gulp-imagemin'),
    gulp_autoprefixer = require('gulp-autoprefixer'),
    gulp_svg2png      = require('./tasks/gulp-svg2png.js'),
    gulp_htmlizr      = require('./tasks/gulp-htmlizr.js');

// global vars

var buildDir = 'build-gulp';

// tasks

gulp.task('font-copy', function()
{
    return gulp.src(['src/fonts/**/*'])
        .pipe(gulp.dest(buildDir + '/assets/fonts'));
});

gulp.task('img-copy', function()
{
    return gulp.src(['src/img/**/*', '!src/img/**/*.svg'])
        .pipe(gulp.dest(buildDir + '/assets/img'));
});

gulp.task('js-copy', function()
{
    return gulp.src(['src/js/**/*'])
        .pipe(gulp.dest(buildDir + '/assets/js'));
});

gulp.task('js-min', function()
{
    return gulp.src(['src/js/**/*.js', '!src/js/**/*.min.js'])
        .pipe(gulp_uglify( { preserveComments: 'some' } ))
        .pipe(gulp_rename( { extname: '.min.js' } ))
        .pipe(gulp.dest(buildDir + '/assets/js'));
});

gulp.task('svg-min', function()
{
    return gulp.src('src/img/**/*.svg')
        .pipe(gulp_svgmin([{ removeViewBox: false }]))
        .pipe(gulp.dest(buildDir + '/assets/img'));

});

gulp.task('svg-2png', ['svg-min'], function()
{
    return gulp.src(buildDir + '/assets/img/**/*.svg')
        .pipe(gulp_svg2png())
        .pipe(gulp.dest(buildDir + '/assets/img'));
});

gulp.task('img-min', ['img-copy', 'svg-2png'], function()
{
    return gulp.src([buildDir + '/assets/img/**/*', '!' + buildDir + '/assets/img/**/*.svg'])
        .pipe(gulp_imagemin())
        .pipe(gulp.dest(buildDir + '/assets/img'));
});

gulp.task('css', ['img-min'], function()
{
    return gulp.src('src/scss/**/*.scss')
        .pipe(gulp_sass({
            precision   : 10,
            outputStyle : 'compressed'
        }))
        .pipe(gulp_autoprefixer())
        .pipe(gulp.dest(buildDir + '/assets/css'));

    // Compass

    // return gulp.src('src/**/*.scss')
    //     .pipe(gulp_sass({
    //         css      : buildDir + '/assets/css',
    //         sass     : 'src/scss',
    //         image    : 'src/img',
    //         fonts    : 'src/fonts',
    //         style    : 'compressed',
    //         comments : true
    //     }));
});

gulp.task('html', function()
{
    return gulp.src(['templates/**/*.html'])
        .pipe(gulp_htmlizr( { 'buildDir': buildDir } ))
        .pipe(gulp.dest(buildDir));
});

gulp.task('js', ['js-copy', 'js-min']);

gulp.task('svg', ['svg-min', 'svg-2png']);

gulp.task('img', ['img-copy', 'img-min']);

gulp.task('assets', function()
{
    gulp.start('font-copy', 'img', 'svg', 'js', 'css');
});

gulp.task('default', function()
{
    gulp.start('assets', 'html');
});
