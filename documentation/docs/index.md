# About ArrayFire

*"ArrayFire is a high performance software library for parallel computing with an easy-to-use API. Its array based function set makes parallel programming more accessible."*

You can read its introduction [int its documentation's index page](http://www.arrayfire.com/docs/index.htm). It's basically a math accelerator C++ library supporting CPU and GPU based backends on Windows, Linux and Mac. And it's just **awesome**. It's extremely simple to write the most complex mathematical, statistical, logical computations, image transformations and computer vision algorigthms with it, just a few lines of code. It has excellent batching capability that takes simple operations, make a big computation from them, and runs all at once on the GPU device.

# About Fire.js

Fire.js is the Node.js bindings for ArrayFire, it uses [CMake.js](https://github.com/unbornchikken/cmake-js) as of its build system. It takes Node.js ridiculous level of productivity and mix that with ArrayFire ridiculous level of performance and simplicity. You'll get something like Matlab just in familiar JavaScript with performance of level of x100 (with a good GPU).

Install instructions can be found in the [project's readme at Github](https://github.com/unbornchikken/fire-js#install).

## (How To) Use ES6 Generators

The original ArrayFire library contains a lot of functions that blocks. They are often run at O(n) atleast on CPU backend, or do some blocking initialization work on first call on OpenCL/CUDA platforms. Because of this those functions are wrapped asynchronously, and can be called with traditional Node.js callbacks, eg.:

```js
fire.srqt(input, function(err, output) {
	if (err) {
    	// crash :)
    }
    else {
    	// continue work ..
    }
});
```

Yeah, this is annoying and ugly compared to the original (blocking) C++ code. The good news is that can be improved by using ES6 generators. Each asynchronous Fire.js method has two counterparts. One synchronous, ends with `"Sync"` (eg. `sqrtSync`). Those are just for supporting REPL prototyping scenarios, not intended to use in production code, because those blocks the vent loop and uses spin locks. The other is an asynchronous version that returns a [Bluebird promise](https://www.npmjs.com/package/bluebird), ends with `"Async"` (eg. `sqrtAsync`). Wrap an [ES6 generator function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) by a [coroutine](https://github.com/petkaantonov/bluebird/blob/master/API.md#promisecoroutinegeneratorfunction-generatorfunction---function), and you can yield those promises from there:

```js
let async = Bluebird.coroutine;

let f = async(function*() {
	let output = yield fire.sqrtAsync(input);
});
```

And voila, you can write asynchronous code that looks like synchronous. It's exactly the same thing those [async/await features](https://msdn.microsoft.com/en-us/library/hh191443.aspx) that C# guys have! (Of course you can use some other coroutine library, like [co](https://www.npmjs.com/package/co).)

To run ES6 code you can use io.js that supports it inherently. Or use Node.js 0.12+ with --harmony flag. Or you can go with older Node.js versions with Gulp and Traceur modules.

Even you can use feature detection and can write code that can run on each platform choosing ES5 or ES6 code paths depending of the actual runtime. Fire.js uses that method too. It has been developed in ES6, and uses [Gulp/Traceur](https://github.com/unbornchikken/fire-js/blob/master/gulpfile.js) and [feature detection](https://github.com/unbornchikken/fire-js/blob/master/lib/index.js#L19) to fallback to manually compiled ES5 code on older runtimes. If you need further information about this topic, please open up an issue on Github, and I'll help you out with this there.

## Small Example

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

## License

[Apache 2.0](https://github.com/unbornchikken/fire-js/blob/master/LICENSE)