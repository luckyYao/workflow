var gulp = require('gulp');
var connect = require('gulp-connect');
var babel = require('gulp-babel');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('babel', function() {
  gulp.src('./src/*.js')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest('lib'))
});

gulp.task("browserify", function () {
  var b = browserify({
    entries: "lib/app.js"
  });
  return b.bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("lib"));
});

gulp.task('connect', function() {
  connect.server({
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('./*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./*.html'], ['html']);
  gulp.watch(['./src/*.js'], ['babel', 'browserify']);
});

gulp.task('default', ['html', 'connect', 'babel', 'browserify', 'watch']);
