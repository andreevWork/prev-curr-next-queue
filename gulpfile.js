var gulp = require("gulp"),
    ts = require("gulp-typescript"),
    TypingsFile = 'typings/index.d.ts';

gulp.task("default", function () {
    return gulp.src('src/**/*.ts')
        .pipe(ts({
            "noImplicitAny": true,
            "removeComments": true,
            "target": "es5"
        }))
        .js.pipe(gulp.dest('dist/'));
});

gulp.task("test", function () {
    return gulp.src(['test/**/*.ts', TypingsFile])
        .pipe(ts({
            noImplicitAny: true
        }))
        .js.pipe(gulp.dest('test/_build/'));
});
