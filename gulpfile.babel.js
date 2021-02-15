const gulp = require('gulp');
const browserify = require('gulp-browserify');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

const onError = function (err) {
    gutil.beep();
    console.log(err);
};

const buildFile = (done) => {
    gulp.src('./src/index.js')
        .pipe(
            browserify({
                insertGlobals: true,
            }),
        )
        .pipe(rename('kennitala.js'))
        .pipe(gulp.dest('./'));
    done();
};

const buildMinified = (done) => {
    gulp.src('./src/index.js')
        .pipe(
            browserify({
                insertGlobals: true,
            }),
        )
        .pipe(uglify())
        .pipe(rename('kennitala.min.js'))
        .pipe(gulp.dest('./'));
    done();
};

gulp.task('default', gulp.parallel(buildMinified, buildFile));
gulp.task('build', gulp.parallel(buildMinified, buildFile));
