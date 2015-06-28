# ArrayFire.js

**Please follow [this issue](https://github.com/arrayfire/arrayfire_js/issues/1) for tracking the progress towards release of 1.0.0-beta.**

## About ArrayFire

*"ArrayFire is a high performance software library for parallel computing with an easy-to-use API. Its array based function set makes parallel programming more accessible."*

You can read its introduction [int its documentation's index page](http://www.arrayfire.com/docs/index.htm). It's basically a math accelerator C++ library supporting CPU and GPU based backends on Windows, Linux and Mac. And it's just **awesome**. It's extremely simple to write the most complex mathematical, statistical, logical computations, image transformations and computer vision algorigthms with it, just a few lines of code. It has excellent batching capability that takes simple operations, make a big computation from them, and runs all at once on the GPU device.

## About ArrayFire.js

ArrayFire.js is the Node.js bindings for ArrayFire, it uses [CMake.js](https://github.com/unbornchikken/cmake-js) as of its build system. It takes Node.js' insane level of productivity and mix that with ArrayFire's insane level of performance and simplicity. You'll get something like Matlab just in familiar JavaScript with performance level of x100+ compared to V8 computation preformance (with a good GPU).

## Requirements

- [Download](http://arrayfire.com/download/) and install ArrayFire (3.x RTM is supported right now). Don't forget to add `%AF_PATH%\lib` directory to PATH on Windows!    
- On Linux or Mac install dependencies (see [Linux](https://github.com/arrayfire/arrayfire/wiki/Build-Instructions-for-Linux#installing-dependencies) and [Mac docs](https://github.com/arrayfire/arrayfire/wiki/Build-Instructions-for-OSX#installing-dependencies))
- Don't forget to install [CMake](http://www.cmake.org/)

## Install

Before installing location of the ArrayFire installation directory have to be configured for CMake.js. There are two options:

**1. Using [npm config](https://github.com/unbornchikken/cmake-js#npm-config-integration)**

**for current user:**

```
npm config set cmake_af_path "path_to_arrayfire_installation_directory"
```

**for all users (global)**

```
npm config set cmake_af_path "path_to_arrayfire_installation_directory" --global
```

**2. Setting AF_PATH environment variable**

```
AF_PATH="path_to_arrayfire_installation_directory"
```

On Windows the installer do this for you, so there is nothing to do on this platform, though.

The above have to be done only once. After you can install ArrayFire.js from the npm:

```
npm install arrayfire_js --save
```

## Usage

```js
// CPU
var af = require("arrayfire_js")("CPU");
// OpenCL
var af = require("arrayfire_js")("OpenCL");
// CUDA
var af = require("arrayfire_js")("CUDA");
```

### Small Example

Port of the PI calculator from [ArrayFire documentation](http://www.arrayfire.com/docs/index.htm):

**C++**

```C++
// sample 40 million points on the GPU
array x = randu(20e6), y = randu(20e6);
array dist = sqrt(x * x + y * y);

// pi is ratio of how many fell in the unit circle
float num_inside = sum<float>(dist < 1);
float pi = 4.0 * num_inside / 20e6;
af_print(pi);
```

**JavaScript**

*Notice: Remember, in Node.js everything that blocks or might blocks should be asynchronous, so it is advised to call asynchronous variants of ArrayFire.js functions, however there are synchronous counterparts available too for supporting REPL scenarios. (I suggest use [ES6 generators](http://arrayfire.github.io/arrayfire_js/#how-to-use-es6-generators) instead of callback hell or even instead of bare promises).*

```js
const numberOfPoints = 20000000;

// ...

let x = af.randu(numberOfPoints, af.types.dtype.f32);
let y = af.randu(numberOfPoints, af.types.dtype.f32);
let dist = af.sqrt(x.mul(x).add(y.mul(y)));
let numInside = yield af.sumAsync(dist.lt(1));
let piVal = (4.0 *  numInside) / numberOfPoints;

console.log(`PI = ${piVal}`);
```

It's included in the [examples folder](https://github.com/arrayfire/arrayfire_js/blob/master/examples/es6/bechmarks/pi.js). To run on:

- io.js, enter: `iojs examples/es6/bechmarks/pi.js`
- Node.js 0.12 or above, enter: `node --harmony examples/es6/bechmarks/pi.js`
- Node.js below 0.12, enter: `node examples/es5/bechmarks/pi.js`

## API Docs

[In progress ...](http://arrayfire.github.io/arrayfire_js/) We'll try to put it together soon.

## Wanna Contribute?

PRs are welcome, but please read the [Contributing Guide](https://github.com/arrayfire/arrayfire_js/blob/master/CONTRIBUTING.md) first.

## License

[New BSD](https://github.com/arrayfire/arrayfire_js/blob/master/LICENSE)

```
Copyright (c) 2014-2015, ArrayFire
Copyright (c) 2015 Gábor Mező aka unbornchikken (gabor.mezo@outlook.com)
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
```
