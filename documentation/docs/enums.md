# Static Objects

They are accessible from the main Fire.js context object, eg.:

```js
var af = require("arrayfire-js")("CPU");

// dType:
var dType = af.dType;
```

## TOC

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [dType](#dtype)
- [source](#source)
- [matchType](#matchtype)
- [borderType](#bordertype)
- [connectivity](#connectivity)
- [convDomain](#convdomain)
- [convMode](#convmode)
- [cSpace](#cspace)
- [interpType](#interptype)
- [matProp](#matprop)
- [normType](#normtype)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## dType

alias: `dtype`

```js
{
    f32: 0, // float
    c32: 1, // complex of float
    f64: 2, // double
    c64: 3, // complex of double
    b8: 4, // boolean (8 bits)
    s32: 5, // int
    u32: 6, // uint
    u8: 7, // byte
    s64: 8, // int64    
    u64: 9 // uint64
}
```

## source

```js
{
    device: 0,
    host: 1,
    // ArrayFire convention compatible aliases:
    afDevice: 0,  
    afHost: 1
}
```

## matchType

```js
{
    SAD: 0,     // Match based on Sum of Absolute Differences (SAD)
    zSAD: 1,    // Match based on Zero mean SAD.
    lSAD: 2,    // Match based on Locally scaled SAD.
    SSD: 3,     // Match based on Sum of Squared Differences (SSD)
    zSSD: 4,    // Match based on Zero mean SSD.
    lSSD: 5,    // Match based on Locally scaled SSD.
    NCC: 6,     // Match based on Normalized Cross Correlation (NCC)
    zNCC: 7,    // Match based on Zero mean NCC.
    SHD: 8,     // Match based on Sum of Hamming Distances (SHD)
    // ArrayFire convention compatible aliases:
    AF_SAD: 0,
    AF_ZSAD: 1,
    AF_LSAD: 2,
    AF_SSD: 3,
    AF_ZSSD: 4,
    AF_LSSD: 5,
    AF_NCC: 6,
    AF_ZNCC: 7,
    AF_SHD: 8
}
```

## borderType

```js
{
    padZero: 0,
    padSym: 1,
    // ArrayFire convention compatible aliases:
    AF_PAD_ZERO: 0,
    AF_PAD_SYM: 1
}
```

## connectivity

```js
{
    connectivity4: 4,
    connectivity8: 8,
    // ArrayFire convention compatible aliases:
    AF_CONNECTIVITY_4: 4,
    AF_CONNECTIVITY_8: 8
}
```

## convDomain

```js
{
    auto: 0,    ///< ArrayFire automatically picks the right convolution algorithm
    spatial: 1, ///< Perform convolution in spatial domain
    freq: 2,   ///< Perform convolution in frequency domain
    // ArrayFire convention compatible aliases:
    AF_CONV_AUTO: 0,    ///< ArrayFire automatically picks the right convolution algorithm
    AF_CONV_SPATIAL: 1, ///< Perform convolution in spatial domain
    AF_CONV_FREQ: 2   ///< Perform convolution in frequency domain
}
```

## convMode

```js
{
    ///
    /// Output of the convolution is the same size as input
    ///
    default: 0,
    ///
    /// Output of the convolution is signal_len + filter_len - 1
    ///
    expand: 1,
    // ArrayFire convention compatible aliases:
    AF_CONV_DEFAULT: 0,
    AF_CONV_EXPAND: 1
}
```

## cSpace

```js
{
    Gray: 0, ///< Grayscale
    RGB: 1,      ///< 3-channel RGB
    HSV: 2,       ///< 3-channel HSV
    // ArrayFire convention compatible aliases:
    AF_GRAY: 0, ///< Grayscale
    AF_RGB: 1,      ///< 3-channel RGB
    AF_HSV: 2       ///< 3-channel HSV
}
```

## interpType

```js
{
    nearest: 0,  ///< Nearest Interpolation
    linear: 1,   ///< Linear Interpolation
    bilinerar : 2, ///< Bilinear Interpolation
    cubic: 3,    ///< Cubic Interpolation,
    // ArrayFire convention compatible aliases:
    AF_INTERP_NEAREST: 0,  ///< Nearest Interpolation
    AF_INTERP_LINEAR: 1,   ///< Linear Interpolation
    AF_INTERP_BILINEAR : 2, ///< Bilinear Interpolation
    AF_INTERP_CUBIC: 3     ///< Cubic Interpolation
}
```

## matProp

```js
{
    none       : 0,    ///< Default
    trans      : 1,    ///< Data needs to be transposed
    cTrans     : 2,    ///< Data needs to be conjugate tansposed
    upper      : 32,   ///< Matrix is upper triangular
    lower      : 64,   ///< Matrix is lower triangular
    diagUnit   : 128,  ///< Matrix diagonal contains unitary values
    sym        : 512,  ///< Matrix is symmetric
    posDef     : 1024, ///< Matrix is positive definite
    orthog     : 2048, ///< Matrix is orthogonal
    triDiag    : 4096, ///< Matrix is tri diagonal
    blockDiag  : 8192,  ///< Matrix is block diagonal
    // ArrayFire convention compatible aliases:
    AF_MAT_NONE       : 0,    ///< Default
    AF_MAT_TRANS      : 1,    ///< Data needs to be transposed
    AF_MAT_CTRANS     : 2,    ///< Data needs to be conjugate tansposed
    AF_MAT_UPPER      : 32,   ///< Matrix is upper triangular
    AF_MAT_LOWER      : 64,   ///< Matrix is lower triangular
    AF_MAT_DIAG_UNIT  : 128,  ///< Matrix diagonal contains unitary values
    AF_MAT_SYM        : 512,  ///< Matrix is symmetric
    AF_MAT_POSDEF     : 1024, ///< Matrix is positive definite
    AF_MAT_ORTHOG     : 2048, ///< Matrix is orthogonal
    AF_MAT_TRI_DIAG   : 4096, ///< Matrix is tri diagonal
    AF_MAT_BLOCK_DIAG : 8192  ///< Matrix is block diagonal
}
```

## normType

```js
{
    nearest: 0,  ///< Nearest Interpolation
    linear: 1,   ///< Linear Interpolation
    bilinerar : 2, ///< Bilinear Interpolation
    cubic: 3,    ///< Cubic Interpolation,
    // ArrayFire convention compatible aliases:
    AF_INTERP_NEAREST: 0,  ///< Nearest Interpolation
    AF_INTERP_LINEAR: 1,   ///< Linear Interpolation
    AF_INTERP_BILINEAR : 2, ///< Bilinear Interpolation
    AF_INTERP_CUBIC: 3     ///< Cubic Interpolation
}
```