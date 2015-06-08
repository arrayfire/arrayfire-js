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