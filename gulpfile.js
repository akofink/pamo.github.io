var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var imageop = require('gulp-image-optimization');

var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

gulp.task('images', function(cb) {
    gulp.src(['_site/images/**/*.png','_site/images/**/*.jpg','_site/images/**/*.gif','_site/images/**/*.jpeg']).pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })).pipe(gulp.dest('_site/images')).on('end', cb).on('error', cb);
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['copy','images', 'sass', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    gulp.src(['_scss/**/*.scss'])
        .pipe(sass({
            includePaths: ['scss'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('_site/css'))
        .pipe(browserSync.reload({stream: true}))
        .pipe(gulp.dest('css'));
    gulp.src(['bower_components/foundation/scss/foundation.scss','bower_components/font-awesome/scss/font-awesome.scss'])
        .pipe(sass({
            includePaths: ['bower_components/'],
            onError: browserSync.notify
        }))
        .pipe(gulp.dest('_site/css/lib'))
        .pipe(browserSync.reload({stream: true}))
        .pipe(gulp.dest('css/lib'));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch(['_scss/*.scss', 'bower_components/**/*.scss'], ['sass']);
    gulp.watch(['*.yml', '*.html', '_layouts/*.html', '_posts/*'], ['jekyll-rebuild']);
});

gulp.task('copy', function(){
    gulp.src(['bower_components/**/*.js'])
        .pipe(gulp.dest('_site/js/lib'))
        .pipe(gulp.dest('js/lib'));
    gulp.src(['bower_components/font-awesome/fonts/*'])
        .pipe(gulp.dest('_site/css/fonts/'))
        .pipe(gulp.dest('css/fonts'));
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);