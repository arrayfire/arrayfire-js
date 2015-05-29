"use strict";

var es6 = true;
try {
    eval("(function *(){})");
} catch(err) {
    es6 = false;
}

if (es6) {
    module.exports = require("./es6");
}
else {
    require("traceur-runtime");
    module.exports = require("./es5");
}