var gulp = require("gulp");
var traceur = require("gulp-traceur");
var gulpSequence = require("gulp-sequence");
var spawn = require("child_process").spawn;

gulp.task("compile-test", function () {
    return gulp.src("tests/es6/**/*.js", {base: "tests/es6"})
        .pipe(traceur({sourceMaps: "inline"}))
        .pipe(gulp.dest("tests/es5"));
});

gulp.task("compile-lib", function () {
    return gulp.src("lib/es6/**/*.js", {base: "lib/es6"})
        .pipe(traceur({sourceMaps: "inline"}))
        .pipe(gulp.dest("lib/es5"));
});

gulp.task("compile", gulpSequence(["compile-test", "compile-lib"]));

gulp.task("default", gulpSequence("compile"));

gulp.task("npm-publish", function (done) {
    spawn("npm", ["publish"], { stdio: "inherit" }).on("close", done);
});

gulp.task("publish", gulpSequence("compile", "npm-publish"));
