# Functions to create arrays

[-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__data__mat.htm)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [randu()](#randu)
- [randU()](#randu)
- [randn()](#randn)
- [randN()](#randn)
- [identity()](#identity)
- [range()](#range)
- [iota()](#iota)
- [diag()](#diag)
- [constant()](#constant)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## randu()

Create a random array sampled from uniform distribution.

- `randu(dim0, type)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__data__func__randu.htm#gab3e2105aec551cb0bbcf104d437c0481)
- `randu(dim0, dim1, type)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__data__func__randu.htm#ga9a08025609da7db72c3a22493f85a171)
- `randu(dim0, dim1, dim2, type)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__data__func__randu.htm#gae0d335466e5f5a1cb821dc241804923b)
- `randu(dim0, dim1, dim2, dim3, type)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__data__func__randu.htm#gac05c5b2de1cfc2d763b7d2943e9deee3)
- `randu(dims, type)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__data__func__randu.htm#ga15a5110a447509cab9589b2ad56c5e55)

**Arguments:**

- **dim0 .. dim3: Number** - size of the dimension
- **dims: Array|[Dim4](Dim4)** - specifies sizes of the dimensions, eg: `[2, 1, 1]` or `new Dim4(3, 4)`
- **type: value of [dType](statics/#typesdtype)** - can be one of the values of dType object (eg. `dType.f32`)

**Result**: the created AFArray instance.

## randU()

alias of [randu()](#randu)

## randn()

Create a random array sampled from normal distribution.

- `randn(dim0, type)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__data__func__randn.htm#ga5d7b55d3d0f34d71f30a70ed7a2d928d)
- `randn(dim0, dim1, type)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__data__func__randn.htm#ga5fe422f8cf2acc3c6f782f9148360f6c)
- `randn(dim0, dim1, dim2, type)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__data__func__randn.htm#ga150fb95ddda0e37e8961254ca7afc8e5)
- `randn(dim0, dim1, dim2, dim3, type)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__data__func__randn.htm#ga9bc154f0bf07116ad208b2da4b71c3d8)
- `randn(dims, type)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__data__func__randn.htm#gae8aa1f5ec310aeb9e4cbd19d63998349)

**Arguments:**

- **dim0 .. dim3: Number** - size of the dimension
- **dims: Array|[Dim4](Dim4)** - specifies sizes of the dimensions, eg: `[2, 1, 1]` or `new Dim4(3, 4)`
- **type: value of [dType](statics/#typesdtype)** - can be one of the values of dType object (eg. `dType.f32`)

**Result**: the created AFArray instance.

## randN()

alias of [randn()](#randn)

## identity()

Create an identity matrix (array with diagonal values 1).

- `identity(dim0, type)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__data__func__identity.htm#ga3f69c0a0ab7ba0c8c1ee3223772234b8)
- `identity(dim0, dim1, type)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__data__func__identity.htm#gaff9da6e4b83772359d748a4df66ec571)
- `identity(dim0, dim1, dim2, type)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__data__func__identity.htm#ga405b89c8f04901d58287fd6a8f5612c3)
- `identity(dim0, dim1, dim2, dim3, type)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__data__func__identity.htm#ga8e6605d76748c5fff365830e1a153132)
- `identity(dims, type)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__data__func__identity.htm#gafd8247e22fdb50218926d5d9391fa678)

**Arguments:**

- **dim0 .. dim3: Number** - size of the dimension
- **dims: Array|[Dim4](Dim4)** - specifies sizes of the dimensions, eg: `[2, 1, 1]` or `new Dim4(3, 4)`
- **type: value of [dType](statics/#typesdtype)** - can be one of the values of dType object (eg. `dType.f32`)

**Result**: the created AFArray instance.

## range()

Creates an array with [0, n] values along the seqDim which is tiled across other dimensions.

- `range(dim0, seqDim, type)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__data__func__range.htm#ga1e2ae1f90d99f42854a19877261ac455)
- `range(dim0, dim1, seqDim, type)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__data__func__range.htm#ga1e2ae1f90d99f42854a19877261ac455)
- `range(dim0, dim1, dim2, seqDim, type)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__data__func__range.htm#ga1e2ae1f90d99f42854a19877261ac455)
- `range(dim0, dim1, dim2, dim3, seqDim, type)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__data__func__range.htm#ga1e2ae1f90d99f42854a19877261ac455)
- `range(dims, seqDim, type)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__data__func__range.htm#ga3789475e962b4c31e07c1c3bdab8498b)

**Arguments:**

- **dim0 .. dim3: Number** - size of the dimension
- **dims: Array|[Dim4](Dim4)** - specifies sizes of the dimensions, eg: `[2, 1, 1]` or `new Dim4(3, 4)`
- **seqDim: Number** - dimension along which [0, dim[seqDim] - 1] is generated, default is -1, which means the last specified dimension 
- **type: value of [dType](statics/#typesdtype)** - can be one of the values of dType object (eg. `dType.f32`)

**Result**: the created AFArray instance.

## iota()

Create an sequence [0, dims.elements - 1] and modify to specified dimensions dims and then tile it according to tileDims.

- `iota(dims, tileDims, type)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__data__func__iota.htm#ga8f7c55a54d1f93e55340f59b61662f29)

**Arguments:**

- **dims: Array|[Dim4](Dim4)** - specifies sizes of the dimensions, eg: `[2, 1, 1]` or `new Dim4(3, 4)`
- **tileDims: Array|[Dim4](Dim4)** - specifies the tiling dimensions, eg: `[2, 1, 1]` or `new Dim4(3, 4)`
- **type: value of [dType](statics/#typesdtype)** - can be one of the values of dType object (eg. `dType.f32`)

**Result**: the created AFArray instance.

## diag()

Extract diagonal from a matrix when `extract` is set to `true`. 

Create a diagonal marix from input array when `extract` is set to `false`.

- `diag(in, num, extract)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__data__func__diag.htm#ga0cf9ea583e513631ed0226aa08ff60da)

**Arguments:**

- **in: AFArray** - input array
- **num: Number** - diagonal index
- **extract: Boolean** - when true returns an array containing diagonal of tha matrix and when false returns a matrix with in as diagonal

## constant()

Create an array filled with the specified value.

- `constant(value, dim0, type)`
- `constant(value, dim0, dim1, type)`
- `constant(value, dim0, dim1, dim2, type)`
- `constant(value, dim0, dim1, dim2, dim3, type)`
- `constant(value, dims, type)`

**Arguments:**

- **value: Number|[Complex](Complex)|String**
    - **Number:** number
    - **[Complex](Complex):** complex value
    - **String:**: number value (to workaround JavaScript inability to hold int64 values)
- **dim0 .. dim3: Number** - size of the dimension
- **dims: Array|[Dim4](Dim4)** - specifies sizes of the dimensions, eg: `[2, 1, 1]` or `new Dim4(3, 4)`
- **type: value of [dType](statics/#typesdtype)** - can be one of the values of dType object (eg. `dType.f32`)

**Result**: the created AFArray instance.