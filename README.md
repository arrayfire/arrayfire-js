# Fire.js v0.0.6-PROTOTYPE

## About

Fire.js - [ArrayFire](http://arrayfire.com/) for Node.js platform. It uses [CMake.js](https://github.com/unbornchikken/cmake-js) as of its build system.

## Requirements

- [Download](http://arrayfire.com/download/) and install ArrayFire (3.0 RTM is supported right now). Don't forget to add `%AF_PATH%\lib` directory to PATH on Windows!    
- On Linux or Mac install dependencies (see [Linux](https://github.com/arrayfire/arrayfire/wiki/Build-Instructions-for-Linux#installing-dependencies) and [Mac docs](https://github.com/arrayfire/arrayfire/wiki/Build-Instructions-for-OSX#installing-dependencies))
- Don't forget to install [CMake](http://www.cmake.org/)

## Install

Before installing location of the ArrayFire installation directory have to be configured for CMake.js. There are two options:

#### 1. Using [npm config](https://github.com/unbornchikken/cmake-js#npm-config-integration)

#### for current user:

```
npm config set cmake_af_path "path_to_arrayfire_installation_directory"
```

#### for all users (global):

```
npm config set cmake_af_path "path_to_arrayfire_installation_directory" --global
```

#### 2. Setting AF_PATH environment variable

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

## Docs

Don't have yet, sorry. See the unit tests they are pretty obvious.

## License

[MIT](https://github.com/unbornchikken/fire-js/blob/master/LICENSE)
