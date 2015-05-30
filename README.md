# Fire.js v0.0.1-PROTOTYPEgul

## About

Fire.js - [ArrayFire](http://arrayfire.com/) for Node.js platform. It uses [CMake.js](https://github.com/unbornchikken/cmake-js) as of its build system.

## Requirements

- [Download](http://arrayfire.com/download/) and install ArrayFire, AF_PATH variable should be set to ArrayFire install dir
- On Linux or Mac install dependencies (see [Linux](https://github.com/arrayfire/arrayfire/wiki/Build-Instructions-for-Linux#installing-dependencies) and [Mac docs](https://github.com/arrayfire/arrayfire/wiki/Build-Instructions-for-OSX#installing-dependencies))
- Don't forget to install [CMake](http://www.cmake.org/)

## Install

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

## Docs

Don't have yet, sorry. See the unit tests they are pretty obvious.

## License

[MIT](https://github.com/unbornchikken/fire-js/blob/master/LICENSE)
