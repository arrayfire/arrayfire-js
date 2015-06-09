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

"use strict";

let lodash = require("lodash");
let assert = require("better-assert");

function Seq(begin, end, step, isGFor) {
    assert(_.isNumber(begin));
    assert(_.isNumber(end));
    step = step || 1;
    assert(_.isNumber(step));
    isGFor = !!isGFor;

    this.begin = begin;
    this.end = end;
    this.step = step;
    this.isGFor = isGFor;
}

module.exports = Seq;