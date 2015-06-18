# Static Objects

They are accessible from the main Fire.js context object, eg.:

```js
var fire = require("fire-js")("CPU");

// dType:
var dType = fire.types.dType;
```

## types.dType

alias: `types.dtype`

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

## types.source

```js
{
    device: 0,
    host: 1,
    // ArrayFire convention compatible aliases:
    afDevice: 0,  
    afHost: 1
}
```

## types.matchType

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