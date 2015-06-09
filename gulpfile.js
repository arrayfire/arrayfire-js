/*
Copyright 2015 Gábor Mezõ aka unbornchikken (gabor.mezo@outlook.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

var gulp = require("gulp");
var traceur = require("gulp-traceur");
var gulpSequence = require("gulp-sequence");
var exec = require("child_process").exec;

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

gulp.task("compile-examples", function () {
    return gulp.src("examples/es6/**/*.js", {base: "examples/es6"})
        .pipe(traceur({sourceMaps: "inline"}))
        .pipe(gulp.dest("examples/es5"));
});

gulp.task("compile", gulpSequence(["compile-test", "compile-lib", "compile-examples"]));

gulp.task("default", gulpSequence("compile"));

gulp.task("npm-publish", function (done) {
    exec("npm publish").on("close", function(e) {
        if (e) {
            done(new Error("Cannot publish to the npm. Exit code: " + e + "."));
        }
        else {
            done();
        }
    });
});

gulp.task("publish", gulpSequence("compile", "npm-publish"));
