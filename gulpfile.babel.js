const gulp = require('gulp');
const browserify = require('gulp-browserify');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

const onError = function (err) {
    gutil.beep();
    console.log(err);
};

gulp.task('default', ['buildFile', 'buildMinified']);
gulp.task('build', ['buildFile', 'buildMinified']);

gulp.task('buildFile', () => {
    gulp.src('src/index.js')
        .pipe(browserify({
          insertGlobals : true
        }))
        .pipe(rename('kennitala.js'))
        .pipe(gulp.dest(''));
});

gulp.task('buildMinified', () => {
    gulp.src('src/index.js')
        .pipe(browserify({
          insertGlobals : true
        }))
        .pipe(uglify())
        .pipe(rename('kennitala.min.js'))
        .pipe(gulp.dest(''));
});