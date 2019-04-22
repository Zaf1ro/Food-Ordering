const gulp = require('gulp');
const del = require('del');
const pug = require('gulp-pug');
const cleanCSS = require('gulp-clean-css');

const paths = {
    views: {
        src: 'views/404.pug',
        dest: 'dist/views/'
    },
    styles: {
        src: 'public/css/*.css',
        dest: 'dist/css/'
    },
    scripts: {
        src: 'public/js/*.js',
        dest: 'dist/js/'
    },
    images: {
        src: 'public/img/'
    }
};

// clean legacy code
const clean = () => {
    return del(['dist']);
};

/**
 * Build html from views
 * FIXME: not to be used
 */
const views = () => {
    return gulp.src(paths.views.src)
        .pipe(pug({
            doctype: 'html',
            pretty: true
        }))
        .pipe(gulp.dest(paths.views.dest));
};

/**
 * Clean and optimize css files
 */
function styles() {
    return gulp.src(paths.styles.src) // .pipe(less()) TODO: use less instead of raw css
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.styles.dest));
}

const build = gulp.series(clean, gulp.parallel(styles));

module.exports = {
    clean: clean,
    views: views,
    default: build
};