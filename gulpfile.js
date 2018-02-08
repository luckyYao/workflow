const gulp = require('gulp');

// liveload
const connect = require('gulp-connect');

// es6 -> es5
const babel = require('gulp-babel');
const browserify = require('browserify');
const source = require('vinyl-source-stream');

// js compress
const uglify = require('gulp-uglify');

// sass -> css
const sass = require('gulp-ruby-sass');

const opts = {
  dist: './dist/',
  jsFiles: './src/js/*.js',
  distJs: './dist/js/',
  scssFiles: './src/scss/*.scss',
  distCss: './dist/css',
  htmlFiles: './*.html',
  watchFiles: ['src/*.html', 'src/css/*.css', 'src/js/*.js'],
};

gulp.task('babel', () => {
  gulp.src(opts.jsFiles)
    .pipe(babel({
      presets: ['env'],
    }))
    .pipe(connect.reload())
    .pipe(uglify())
    .pipe(gulp.dest(opts.distJs));
});

gulp.task('browserify', () => {
  const b = browserify({
    entries: `${opts.distJs}app.js`,
  });
  return b.bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(opts.distJs));
});

gulp.task('sass', () => (
  sass(opts.scssFiles, {
    style: 'compressed',
  })
    .pipe(connect.reload())
    .pipe(gulp.dest(opts.distCss))
));

gulp.task('connect', () => {
  connect.server({
    livereload: true,
  });
});

gulp.task('html', () => {
  gulp.src(opts.htmlFiles)
    .pipe(connect.reload());
});

gulp.task('watch', () => {
  gulp.watch([opts.htmlFiles], ['html']);
  gulp.watch([opts.jsFiles], ['babel', 'browserify']);
  gulp.watch([opts.scssFiles], ['sass']);
});

gulp.task('default', ['html', 'connect', 'babel', 'browserify', 'sass', 'watch']);
