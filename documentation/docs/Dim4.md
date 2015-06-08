# Dim4 class

## constructors

- `new Dim4(dimArray)`
- `new Dim4(dim0, dim1, dim2, dim3)`

**Arguments**:

- **dimArray: Array** - array holding dimension sizes, eg.: [1, 2], [1, 5, 6], [4, 5, 1, 1]
- **dim0 .. dim3: Number** - size of the dimension, default is 1

## Properties

### dims

**Value:** **Array** containing the dimension sizes, eg.: two dimensions = `[2, 3, 1, 1]`, four dimensions = `[2, 3, 4, 5]`

### ndims

alias: `nDims`

**Value:** number of dimensions

### elements

**Value:** number of elements (dim0 * dim1 * dim2 * dim3)