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

let matchType = module.exports = {
    SAD: 0,
    zSAD: 1,
    lSAD: 2,
    SSD: 3,
    zSSD: 4,
    lSSD: 5,
    NCC: 6,
    zNCC: 7,
    SHD: 8,
    AF_SAD: 0,
    AF_ZSAD: 1,
    AF_LSAD: 2,
    AF_SSD: 3,
    AF_ZSSD: 4,
    AF_LSSD: 5,
    AF_NCC: 6,
    AF_ZNCC: 7,
    AF_SHD: 8
};