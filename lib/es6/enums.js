'use strict';

exports.backends = {
    // Default backend order: OpenCL -> CUDA -> CPU.
    DEFAULT: 0,
    // CPU a.k.a sequential algorithms.
    CPU: 1,
    // CUDA Compute Backend.
    CUDA: 2,	
    // OpenCL Compute Backend.
    OPENCL: 3	
};