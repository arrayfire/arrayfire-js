# Fire.js

## About ArrayFire

*"ArrayFire is a high performance software library for parallel computing with an easy-to-use API. Its array based function set makes parallel programming more accessible."*

You can read its introduction [int its documentation's index page](http://www.arrayfire.com/docs/index.htm). It's basically a math accelerator C++ library supporting CPU and GPU based backends on Windows, Linux and Mac. And it's just **awesome**. It's extremely simple to write the most complex mathematical, statistical, logical computations, image transformations and computer vision algorigthms with it, just a few lines of code. It has excellent batching capability that takes simple operations, make a big computation from them, and runs all at once on the GPU device.

## About Fire.js

Fire.js is the Node.js bindings for ArrayFire, it uses [CMake.js](https://github.com/unbornchikken/cmake-js) as of its build system. It takes Node.js ridiculous level of productivity and mix that with ArrayFire ridiculous level of performance and simplicity. You'll get something like Matlab just in familiar JavaScript with performance of level of x100 (with a good GPU).

## Requirements

- [Download](http://arrayfire.com/download/) and install ArrayFire (3.0 RTM is supported right now). Don't forget to add `%AF_PATH%\lib` directory to PATH on Windows!    
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

The above have to be done only once. After you can install Fire.js from the npm:

```
npm install fire-js --save
```

## Usage

```js
// CPU
var fire = require("fire-js")("CPU");
// OpenCL
var fire = require("fire-js")("OpenCL");
// CUDA
var fire = require("fire-js")("CUDA");
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

*Notice: Remember, in Node.js everything that blocks or might blocks should be asynchronous, so it is advised to call asynchronous variants of Fire.js functions, however there are synchronous counterparts available too for supporting REPL scenarios. (I suggest use [ES6 generators](http://unbornchikken.github.io/fire-js/#how-to-use-es6-generators) instead of callback hell or even instead of bare promises).*

```js
const numberOfPoints = 20000000;

// ...

let x = yield fire.randuAsync(numberOfPoints, fire.types.dtype.f32);
let y = yield fire.randuAsync(numberOfPoints, fire.types.dtype.f32);
let dist = yield fire.sqrtAsync((x.mul(x)).add(y.mul(y)));
let num_inside = yield fire.sumAsync(dist.lt(1));
let piVal = (4.0 *  num_inside) / numberOfPoints;

console.log(`PI = ${piVal}`);
```

It's included in the [examples folder](https://github.com/unbornchikken/fire-js/blob/master/examples/es6/bechmarks/pi.js). To run on:

- io.js, enter: `iojs examples/es6/bechmarks/pi.js`
- Node.js 0.12 or above, enter: `node --harmony examples/es6/bechmarks/pi.js`
- Node.js below 0.12, enter: `node examples/es5/bechmarks/pi.js`

## API Docs

[In progress ...](http://unbornchikken.github.io/fire-js/) I'll try to put it together soon.

## License

[Apache 2.0](https://github.com/unbornchikken/fire-js/blob/master/LICENSE)

```
Copyright 2015 Gábor Mező aka unbornchikken

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
