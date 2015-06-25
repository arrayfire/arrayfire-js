/*
Copyright (c) 2014-2015, ArrayFire
Copyright (c) 2015 Gábor Mezõ aka unbornchikken (gabor.mezo@outlook.com)
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright notice, this
  list of conditions and the following disclaimer in the documentation and/or
  other materials provided with the distribution.

 * Neither the name of the ArrayFire nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
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
