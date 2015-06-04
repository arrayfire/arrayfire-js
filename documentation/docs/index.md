# About ArrayFire

*"ArrayFire is a high performance software library for parallel computing with an easy-to-use API. Its array based function set makes parallel programming more accessible."*

You can read its introduction [int its documentation's index page](http://www.arrayfire.com/docs/index.htm). It's basically a math accelerator C++ library supporting CPU and GPU based backends on Windows, Linux and Mac. And it's just **awesome**.

# About Fire.js

Fire.js is the Node.js bindings for ArrayFire. Install instructions can be found in the [project's readme at Github](https://github.com/unbornchikken/fire-js#install).

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

Yeah, this is annoying and ugly compared to the original (blocking) C++ code. The good news is that can be improved by using ES6 generators. First, install a good promise library. I use [Bluebird](https://www.npmjs.com/package/bluebird).

It can promisify all functions with node style callbacks:

```js
let Bluebird = require("bluebird");

let fire = Bluebird.promisifyAll(require("fire-js")("OpenCL"));
```

Wrap an [ES6 generator function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) by a coroutine, and you can yield promises from there:

```js
let async = Bluebird.coroutine;

let f = async(function*() {
	let output = yield fire.sqrtAsync(input);
});
```

And voila, you can write asynchronous code that looks like synchronous. It's exactly the same thing those [async/await features](https://msdn.microsoft.com/en-us/library/hh191443.aspx) that C# guys have!

To run ES6 code you can use io.js that supports it inherently. Or use Node.js 0.12+ with --harmony flag. Or you can go with older Node.js versions with Gulp and Traceur modules.

Even you can use feature detection and can write code that can run on each platform choosing ES5 or ES6 code paths depending of the actual runtime. Fire.js uses that method too. It has been developed in ES6, and uses [Gulp/Traceur](https://github.com/unbornchikken/fire-js/blob/master/gulpfile.js) and [feature detection](https://github.com/unbornchikken/fire-js/blob/master/lib/index.js#L19) to fallback to manually compiled ES5 code on older runtimes. If you need further information about this topic, please open up an issue on Github, and I'll help you out with this there.

## Simple Example

...