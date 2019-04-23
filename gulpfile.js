const gulp = require('gulp'),
      del = require('del'),
      pug = require('gulp-pug'),
      cleanCSS = require('gulp-clean-css'),
      autoprefixer = require('gulp-autoprefixer'),
      cached = require('gulp-cached'),
      uglify = require('gulp-uglify'),
      imagemin = require('gulp-imagemin'),
      babel = require('gulp-babel');

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
        src: ['public/img/*.{jpg,jpeg,png,gif}','public/img/**/*.{jpg,jpeg,png,gif}'],
        dest: 'dist/img/'
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
        .pipe(cached('views'))
        .pipe(pug({
            doctype: 'html',
            pretty: true
        }))
        .pipe(gulp.dest(paths.views.dest));
};

/**
 * Clean and optimize css files
 */
const styles = () => {
    return gulp.src(paths.styles.src) // .pipe(less()) TODO: use less instead of raw css
        .pipe(cached('styles'))
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.styles.dest));
};

/**
 * Compress the scripts file
 */
const scripts = () => {
    return gulp.src(paths.scripts.src)
        .pipe(cached('scripts'))
        .pipe(babel({
            "presets": ["es2015"]
        }))
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.dest));
};

/**
 * Optimize the images
 */
const images = () => {
    return gulp.src(paths.images.src)
        .pipe(cached('image'))
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true,
            multipass: true
        }))
        .pipe(gulp.dest(paths.images.dest));
};

const build = gulp.series(clean, gulp.parallel([styles, scripts, images]));

module.exports = {
    clean: clean,
    views: views,
    styles: styles,
    scripts: scripts,
    images: images,
    default: build
};