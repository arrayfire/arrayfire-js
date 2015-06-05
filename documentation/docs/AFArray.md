# AFArray class

## Staitc methods

### AFArray.create()

asynchronous, counterparts: `createAsync`, `createSync`

Creates an AFArray instance of the specified dimensions, and copies data from the location specified by the buffer. Data can be reside on the host or on the device, the `source` argument specifies its location.

- `create(dim0, buffer, source, callback)`: [template<typename T\> array (dim_t dim0, const T *pointer, af::source src=afHost)](http://www.arrayfire.com/docs/group__construct__mat.htm#ga8c330c41d6e06b0dea9377ef02762c6f)
- `create(dim0, dim1, buffer, source, callback)`: [template<typename T\>	array (dim_t dim0, dim_t dim1, const T *pointer, af::source src=afHost)](http://www.arrayfire.com/docs/group__construct__mat.htm#gaa2ebe6a7b991fbe6231321138e79121c)
- `create(dim0, dim1, dim2, buffer, source, callback)`: [template<typename T\> array (dim_t dim0, dim_t dim1, dim_t dim2, const T *pointer, af::source src=afHost)](http://www.arrayfire.com/docs/group__construct__mat.htm#gabd3d95b130bdb2d7e713414687e6b15a)
- `create(dim0, dim1, dim2, dim3, buffer, source, callback)`: [template<typename T\> array (dim_t dim0, dim_t dim1, dim_t dim2, dim_t dim3, const T *pointer, af::source src=afHost)](http://www.arrayfire.com/docs/group__construct__mat.htm#gaaa8fab98447367bc4eaf3d7bc61d8ff5)
- `create(dim0, dim1, dim2, dim4, buffer, source, callback)`: [template<typename T\>
 	array (dim_t dim0, dim_t dim1, dim_t dim2, dim_t dim3, const T *pointer, af::source src=afHost)](http://www.arrayfire.com/docs/group__construct__mat.htm#gaaa8fab98447367bc4eaf3d7bc61d8ff5)
- `create(dims, buffer, source, callback)`: [template<typename \T> array (const dim4 &dims, const T *pointer, af::source src=afHost)](http://www.arrayfire.com/docs/group__construct__mat.htm#ga1144078b1596e7d29f57b1a0a1c9b1a8)

**Arguments:**

- **dim0 .. dim4: Number** - size of the dimension
- **dims: Array|Dim4** - specifies sizes of the dimentsions, eg: `[2, 1, 1]` or `new Dim4(3, 4)`
- **buffer: Buffer** - data to copy to the device, or device pointer created by the `alloc` method.
- **source: value of source** - can be one of the values of `source` object (eg. `source.host`)

**Result**: the created AFArray instance.

## constructor

Arrays could be created as empty ones or by having a specified dimensions and element type. 

- `new AFArray()`: [array ()](http://www.arrayfire.com/docs/group__construct__mat.htm#ga9cbcfcbf0173e1edaf4094bb36b34b31)
- `new AFArray(dim0, type)`: [array (dim_t dim0, dtype ty=f32)](http://www.arrayfire.com/docs/group__construct__mat.htm#ga73cb9e2360cecbc511b87abf76b6d631)
- `new AFArray(dim0, dim1, type)`: [array (dim_t dim0, dim_t dim1, dtype ty=f32)](http://www.arrayfire.com/docs/group__construct__mat.htm#ga1f0b51e20111680c7fe3c74d54c982dd)
- `new AFArray(dim0, dim1, dim2, type)`: [array (dim_t dim0, dim_t dim1, dim_t dim2, dtype ty=f32)](http://www.arrayfire.com/docs/group__construct__mat.htm#ga69c9fa684e0b0beaf657ac1dc03afa56)
- `new AFArray(dim0, dim1, dim2, dim3, type)`: [array (dim_t dim0, dim_t dim1, dim_t dim2, dim_t dim3, dtype ty=f32)](http://www.arrayfire.com/docs/group__construct__mat.htm#ga6bc7bac9bb52349c198fa0861b5004b7)
- `new AFArray(dims, type)`: [array (const dim4 &dims, dtype ty=f32)](http://www.arrayfire.com/docs/group__construct__mat.htm#ga5686344bf8a49be5286892998d309619)

**Arguments:**

- **dim0 .. dim4: Number** - size of the dimension
- **dims: Array|Dim4** - specifies sizes of the dimentsions, eg: `[2, 1, 1]` or `new Dim4(3, 4)`
- **buffer: Buffer** - data to copy to the device, or device pointer created by the `alloc` method.
- **source: value of dType** - can be one of the values of `dType` object (eg. `dType.f32`)

**Remarks:**

In Fire.js `type` argument is **not optional**.

## Methods

### elements()

Get the number of elements in array.

- `elements()`: [dim_t 	elements () const](http://www.arrayfire.com/docs/group__method__mat.htm#gaf343b49d35978f4b617a65b83a7affb4)

**Result:** Number

### host()

Copy array data to host.

asynchronous, counterparts: `hostAsync`, `hostSync`

- `host(callback)`: [template<typename T\> T * host () const](http://www.arrayfire.com/docs/group__method__mat.htm#gad65cdb27b05827c55d4e2f59f6bbf2b4)
- `host(buffer, callback)`: [void 	host (void *ptr) const](http://www.arrayfire.com/docs/group__method__mat.htm#ga67d1d90fb9f4423a68333104230d930d)

**Arguments:**

- **buffer: Buffer** - to hold array's values, must be atleast the size of the array.

**Result:** if buffer is not specified, then it will be created and returned, otherwise the result is `undefined`

### copyToHost()

alias of [host](#host)

### type
### dims
### numdims
### numDims
### bytes
### copy
### isempty
### isEmpty
### isscalar
### isScalar
### isvector
### isVector
### isrow
### isRow
### iscolumn
### isColumn
### iscomplex
### isComplex
### isreal
### isReal
### isdouble
### isDouble
### issingle
### isSingle
### isrealfloating
### isRealFloating
### isfloating
### isFloating
### isinteger
### isInteger
### isbool
### isBool
### eval

## Indexing Operations

### at
### row
### col
### slice
### rows
### cols
### slices

## Operators

### as
### assign
### set
### add
### addAssign
### sub
### subAssign
### mul
### mulAssign
### div
### divAssign
### bitshiftl
### bitShiftL
### bitshiftr
### bitShiftR
### lt
### gt
### le
### ge
### eq
### neq
### and
### or
### neg
### not
### bitAnd
### bitOr
### bitXor