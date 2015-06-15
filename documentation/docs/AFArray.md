# AFArray class

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Staitc methods](#staitc-methods)
    - [AFArray.create()](#afarraycreate)
- [constructor](#constructor)
- [Methods](#methods)
    - [elements()](#elements)
    - [host()](#host)
    - [copyToHost()](#copytohost)
    - [scalar()](#scalar)
    - [value()](#value)
    - [write()](#write)
    - [type()](#type)
    - [dims()](#dims)
    - [numdims()](#numdims)
    - [numDims()](#numdims)
    - [bytes()](#bytes)
    - [as()](#as)
    - [copy()](#copy)
    - [isempty(), isscalar(), isvector(), isrow(), iscolumn(), iscomplex(), isreal(), isdouble(), issingle(), isrealfloating(), isfloating(), isinteger(), isbool()](#isempty-isscalar-isvector-isrow-iscolumn-iscomplex-isreal-isdouble-issingle-isrealfloating-isfloating-isinteger-isbool)
    - [eval()](#eval)
- [Indexing Operations](#indexing-operations)
    - [at()](#at)
    - [row(), rows()](#row-rows)
    - [col(), cols()](#col-cols)
    - [slice(), slices()](#slice-slices)
- [Assignment Operators](#assignment-operators)
- [Arithmetic Operators](#arithmetic-operators)
- [Logical Operators](#logical-operators)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Staitc methods

### AFArray.create()

asynchronous, counterparts: `createAsync`, `createSync`

Creates an AFArray instance of the specified dimensions, and copies data from the location specified by the buffer. Data can be reside on the host or on the device, the `source` argument specifies its location.

- `create(dim0, buffer, source, callback)` [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__construct__mat.htm#ga8c330c41d6e06b0dea9377ef02762c6f)
- `create(dim0, dim1, buffer, source, callback)` [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__construct__mat.htm#gaa2ebe6a7b991fbe6231321138e79121c)
- `create(dim0, dim1, dim2, buffer, source, callback)` [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__construct__mat.htm#gabd3d95b130bdb2d7e713414687e6b15a)
- `create(dim0, dim1, dim2, dim3, buffer, source, callback)` [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__construct__mat.htm#gaaa8fab98447367bc4eaf3d7bc61d8ff5)
- `create(dim0, dim1, dim2, dim4, buffer, source, callback)` [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__construct__mat.htm#gaaa8fab98447367bc4eaf3d7bc61d8ff5)
- `create(dims, buffer, source, callback)` [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__construct__mat.htm#ga1144078b1596e7d29f57b1a0a1c9b1a8)

**Arguments:**

- **dim0 .. dim3: Number** - size of the dimension
- **dims: Array|[Dim4](Dim4)** - specifies sizes of the dimentsions, eg: `[2, 1, 1]` or `new Dim4(3, 4)`
- **buffer: Buffer** - data to copy to the device, or device pointer created by the `alloc` method.
- **source: value of [source](statics/#typessource)** - can be one of the values of source object (eg. `source.host`)

**Result**: the created AFArray instance.

## constructor

Arrays could be created as empty ones or by having a specified dimensions and element type. 

- `new AFArray()`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__construct__mat.htm#ga9cbcfcbf0173e1edaf4094bb36b34b31)
- `new AFArray(dim0, type)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__construct__mat.htm#ga73cb9e2360cecbc511b87abf76b6d631)
- `new AFArray(dim0, dim1, type)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__construct__mat.htm#ga1f0b51e20111680c7fe3c74d54c982dd)
- `new AFArray(dim0, dim1, dim2, type)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__construct__mat.htm#ga69c9fa684e0b0beaf657ac1dc03afa56)
- `new AFArray(dim0, dim1, dim2, dim3, type)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__construct__mat.htm#ga6bc7bac9bb52349c198fa0861b5004b7)
- `new AFArray(dims, type)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__construct__mat.htm#ga5686344bf8a49be5286892998d309619)

**Arguments:**

- **dim0 .. dim3: Number** - size of the dimension
- **dims: Array|[Dim4](Dim4)** - specifies sizes of the dimentsions, eg: `[2, 1, 1]` or `new Dim4(3, 4)`
- **buffer: Buffer** - data to copy to the device, or device pointer created by the `alloc` method.
- **type: value of [dType](statics/#typesdtype)** - can be one of the values of dType object (eg. `dType.f32`)

**Remarks:**

In Fire.js `type` argument is **not optional**.

## Methods

### elements()

Get the number of elements in array.

- `elements()` [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__method__mat.htm#gaf343b49d35978f4b617a65b83a7affb4)

**Result:** Number

### host()

Copy array data to host.

asynchronous, counterparts: `hostAsync`, `hostSync`

- `host(callback)` [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__method__mat.htm#gad65cdb27b05827c55d4e2f59f6bbf2b4)
- `host(buffer, callback)` [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__method__mat.htm#ga67d1d90fb9f4423a68333104230d930d)

**Arguments:**

- **buffer: Buffer** - to hold array's values, must be atleast the size of the array.

**Result:** if buffer is not specified, then it will be created and returned, otherwise the result is `undefined`

### copyToHost()

alias of [host](#host)

### scalar()

Get scalar value from the array (if its size is larger than one in any dimensions it gives the first value).

asynchronous, counterparts: `scalarAsync`, `scalarSync`

- `scalar(callback)`

**Result: Boolean|Number|String|[Complex](Complex)** value in the array, type depends on the array's type.

### value()

alias of [scalar](#scalar)

### write()

Perform deep copy from host/device pointer to an existing array.

- `write(buffer, bytesToCopy, source, callback)` [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__method__mat.htm#gaa70b253da2d32394c521a815f7627116)

**Arguments:**

- **buffer: Buffer** - data to copy to the array, or device pointer created by the `alloc` method.
- **bytesToCopy**: bytes to copy
- **source: value of [source](statics/#typessource)** - can be one of the values of source object (eg. `source.host`)

### type()

- `type()` [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__method__mat.htm#ga0844daa9b8cc7b7912e89a3d8ddf1a4b)

**Result:** array's element type, can be one of the values of **[dType](statics/#typesdtype)** object

### dims()

- `dims()` [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__method__mat.htm#gaf056729e3ff924f5c1d41e0a8db3ce1b)

**Result:** array's dimensions info in a **[Dim4](Dim4)** object instance

### numdims()

- `numdims()` [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__method__mat.htm#ga269a19b0320a93f19314d4903045b067)

**Result:** number of dimensions of the array

### numDims()

alias of [numdims](#numdims)

### bytes()

- `bytes()` [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__method__mat.htm#gae9a95268261b397cae87b47a59b7e3cb)

**Result:** size of the array in bytes

### as()

Converts the array into another type. 

- `as(type)` [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__method__mat.htm#ga28967fdd5fff8001f4ef6181d9b186fb)

**Arguments:**

- **type: value of [dType](statics/#typesdtype)** - can be one of the values of dType object (eg. `dType.f32`)

**Result:** AFArray instance holding reference the converted array

### copy()

- `copy()` [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__method__mat.htm#gad79c786c646fe05a18e208eabf4dae94)

**Result:** new AFArray instance holding a deep copy of the array

### isempty(), isscalar(), isvector(), isrow(), iscolumn(), iscomplex(), isreal(), isdouble(), issingle(), isrealfloating(), isfloating(), isinteger(), isbool()

aliases respectively: `isEmpty`, `isScalar`, `isVector`, `isRow`, `isColumn`, `isComplex`, `isReal`, `isDouble`, `isSingle`, `isRealFloating`, `isFloating`, `isInteger`, `isBool` 

- `is<anything>`() [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__method__mat.htm#gabe874940ae5ed8c40a8f99913982e657)

**Result:** actual type info (Boolean)

### eval()

- `eval()` [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__method__mat.htm#ga01195c59132e1b0af7655075ba770581)

Evaluate any JIT expressions to generate data for the array.

## Indexing Operations

### at()

[-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__array__mem__operator__paren.htm)

- `at(s0)`
- `at(s0, s1)`
- `at(s0, s1, s2)`
- `at(s0, s1, s2, s3)`

**Arguments**:

- **s0 .. s3: null|String|Number|[Seq](Seq)|AFArray** 

    - **null:** means `"span"`
    - **String:** can be `"span"`
    - **Number:** element's index, or -1 which means the last element
    - **[Seq](Seq):** sequence of values
    - **AFArray:** array holding the index value
    
**Result:** AFArray instance holding reference to the the specified region of the original array

### row(), rows()

Gets a reference of a row in a 2D AFArray.

[-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__array__mem__row.htm)

- `row(index)`
- `rows(firstIndex, lastIndex)`

**Arguments**:

- **index, fistIndex, lastIndex: Number** - a row index or a range of row indices

**Result:** AFArray instance holding reference to the specified region of the original 2D array

### col(), cols()

Gets a reference of a column in a 2D AFArray.

[-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__array__mem__col.htm)

- `col(index)`
- `cols(firstIndex, lastIndex)`

**Arguments**:

- **index, fistIndex, lastIndex: Number** - a column index or a range of column indices

**Result:** AFArray instance holding reference to the specified region of the original 2D array

### slice(), slices()

Gets a reference of a matrix in a 3D AFArray.

[-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__array__mem__slice.htm)

- `slice(index)`
- `slices(firstIndex, lastIndex)`

**Arguments**:

- **index, fistIndex, lastIndex: Number** - a matrix index or a range of matrix indices

**Result:** AFArray instance holding reference to the specified region of the original 3D array

## Assignment Operators

[-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__index__mat.htm)

- `assign(other)` operator =
- `set(other)` operator = (alias of assign)
- `addAssign(other)` operator +=
- `subAssign(other)` operator -=
- `mulAssign(other)` operator *=
- `divAssign(other)` operator /=

**Arguments**:

- **other: AFArray|Number|[Complex](Complex)|String** 

    - **AFArray:** rhs array
    - **Number:** rhs number
    - **[Complex](Complex):** rhs complex value
    - **String:**: rhs number value (to workaround JavaScript inability to hold int64 values)
    
**Result:** assignee AFArray instance

## Arithmetic Operators

[-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__arith__mat.htm)

- `add(other)` operator +
- `sub(other)` operator -
- `mul(other)` operator *
- `div(other)` operator /
- `bitshiftl(other)` operator <<
- `bitShiftL(other)` operator << (alias of bitshiftl)
- `bitshiftr(other)` operator <<
- `bitShiftR(other)` operator << (alias of bitshiftr)

**Arguments**:

- **other: AFArray|Number|[Complex](Complex)|String** 

    - **AFArray:** rhs array
    - **Number:** rhs number
    - **[Complex](Complex):** rhs complex value
    - **String:**: rhs number value (to workaround JavaScript inability to hold int64 values)
    
**Result:** AFArray instance holding the operation's result

## Logical Operators

[-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__logic__mat.htm)

- `neg()` operator -
- `not()` operator !
- `lt(other)` operator <
- `gt(other)` operator >
- `le(other)` operator <=
- `ge(other)` operator >=
- `eq(other)` operator ==
- `neq(other)` operator !=
- `and(other)` operator &&
- `or(other)` operator ||
- `bitAnd(other)` operator &
- `bitOr(other)` operator |
- `bitXor(other)` operator ^

**Arguments**:

- **other: AFArray|Number|[Complex](Complex)|String** 

    - **AFArray:** rhs array
    - **Number:** rhs number
    - **[Complex](Complex):** rhs complex value
    - **String:**: rhs number value (to workaround JavaScript inability to hold int64 values)
    
**Result:** AFArray instance holding the operation's result