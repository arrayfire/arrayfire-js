'use strict';

exports.backend = {
    // Default backend order: OpenCL -> CUDA -> CPU.
    DEFAULT: 0,
    // CPU a.k.a sequential algorithms.
    CPU: 1,
    // CUDA Compute Backend.
    CUDA: 2,
    // OpenCL Compute Backend.
    OPENCL: 3
};

exports.dtype = {
    f32: 0,
    // 32-bit floating point values
    c32: 1,
    // 32-bit complex floating point values
    f64: 2,
    // 64-bit complex floating point values
    c64: 3,
    // 64-bit complex floating point values
    b8: 4,
    // 8-bit boolean values
    s32: 5,
    // 32-bit signed integral values
    u32: 6,
    // 32-bit unsigned integral values
    u8: 7,
    // 8-bit unsigned integral values
    s64: 8,
    // 64-bit signed integral values
    u64: 9,
    // 64-bit unsigned integral values
    s16: 10,
    // 16-bit signed integral values
    u16: 11
    // 16-bit unsigned integral values
};

exports.source = {
    // Device pointer.
    device: 0,
    // Host pointer.
    host: 1
};