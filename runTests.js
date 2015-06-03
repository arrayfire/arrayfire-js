/*
Copyright 2015 Gábor Mezõ aka unbornchikken

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

var Mocha = require("mocha"),
    fs = require("fs"),
    path = require("path");

// First, you need to instantiate a Mocha instance.
var mocha = new Mocha;

// Then, you need to use the method "addFile" on the mocha
// object for each file.
var dir = path.join(__dirname, "tests");

// Here is an example:
fs.readdirSync(dir).filter(function(file){
    // Only keep the .js files
    return file.substr(-3) === ".js";

}).forEach(function(file){
    // Use the method "addFile" to add the file to mocha
    mocha.addFile(
        path.join(dir, file)
    );
});

// Now, you can run the tests.
mocha.run(function(failures){
    process.on("exit", function () {
        process.exit(failures);
    });
});