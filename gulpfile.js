// For development => gulp
// For production  => gulp --p
// For use browserify  => gulp --fy

// Call Plugins
var env         = require('minimist')(process.argv.slice(2)),
    gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    plumber     = require('gulp-plumber'),
    pug         = require('gulp-pug'),
    browserify  = require('gulp-browserify'),
    browserSync = require('browser-sync'),
    uglify      = require('gulp-uglify'),
    concat      = require('gulp-concat'),
    gulpif      = require('gulp-if'),
    stylus      = require('gulp-stylus'),
    rupture     = require('rupture'),
    yeticss     = require('yeticss'),
    axis        = require('axis'),
    prefixer    = require('autoprefixer-stylus'),
    modRewrite  = require('connect-modrewrite'),
    imagemin    = require('gulp-imagemin'),
    karma       = require('gulp-karma'),
    cache       = require('gulp-cache'),
    rsync       = require('rsyncwrapper').rsync;

// Call pug for compile Templates
gulp.task('pug', function () {
    return gulp.src('src/templates/*.pug')
        .pipe(plumber())
        .pipe(pug({pretty: !env.p}))
        .pipe(gulp.dest('build/'));
});

gulp.task('copy', function() {
    return gulp.src(['src/*.html', 'src/*.txt'])
        .pipe(gulp.dest('build/'))
});

// Call Uglify and Concat JS
gulp.task('js', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(plumber())
        .pipe(concat('main.js'))
        .pipe(gulpif(env.p, uglify()))
        .pipe(gulp.dest('build/js'));
});

// Call Uglify and Concat JS
gulp.task('browserify', function () {
    return gulp.src('src/js/main.js')
        .pipe(plumber())
        .pipe(browserify({debug: !env.p}))
        .pipe(gulpif(env.p, uglify()))
        .pipe(gulp.dest('build/js'));
});

// Call Stylus
gulp.task('stylus', function () {
    gulp.src('src/styl/style.styl')
    .pipe(plumber())
        .pipe(stylus({
            use:[prefixer(), yeticss(), axis(), rupture()],
            compress: env.p,
        }))
        .pipe(gulp.dest('build/css'));
});

// Call Imagemin
gulp.task('imagemin', function () {
    return gulp.src('src/img/**/*')
        .pipe(plumber())
        .pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
        .pipe(gulp.dest('build/img'));
});

// Call Watch
gulp.task('watch', function () {
    gulp.watch('src/templates/**/*.pug', ['pug']);
    gulp.watch('src/styl/**/*.styl', ['stylus']);
    gulp.watch('src/js/**/*.js', [(env.fy) ? 'browserify' : 'js']);
    gulp.watch('src/img/**/*.{jpg,png,gif}', ['imagemin']);
});

gulp.task('browser-sync', function () {
    var files = [
       'build/**/*.html',
       'build/css/**/*.css',
       'build/img/**/*',
       'build/js/**/*.js',
    ];

    browserSync.init(files, {
        server: {
            baseDir: './build/',
        },
    });
});

// Rsync
gulp.task('deploy', function () {
    rsync({
        ssh: true,
        src: './build/',
        dest: 'user@hostname:/path/to/www',
        recursive: true,
        syncDest: true,
        args: ['--verbose'],
    },
        function (erro, stdout, stderr, cmd) {
            gutil.log(stdout);
        });
});

// Default task
gulp.task('default', [(env.fy) ? 'browserify' : 'js', 'pug', 'copy', 'stylus', 'imagemin', 'watch', 'browser-sync']);

// Build and Deploy
gulp.task('build', [(env.fy) ? 'browserify' : 'js', 'pug', 'copy', 'stylus', 'imagemin', 'deploy']);
