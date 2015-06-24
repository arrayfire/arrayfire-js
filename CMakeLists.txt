#[[
Copyright (c) 2014-2015, ArrayFire
Copyright (c) 2015 Gábor Mező aka unbornchikken (gabor.mezo@outlook.com)
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright notice, this
  list of conditions and the following disclaimer in the documentation and/or
  other materials provided with the distribution.

* Neither the name of the ArrayFire nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
]]

cmake_minimum_required(VERSION 2.8)

project (arrayfire_js)

set(ArrayFire_DIR "${AF_PATH}")
if (NOT ArrayFire_DIR)
    set(ArrayFire_DIR "$ENV{AF_PATH}")
    if (NOT ArrayFire_DIR)
        message(FATAL_ERROR "Cannot locate ArrayFire installation. Please set cmake_af_path npm config value or AF_PATH environment variable pointing to your ArrayFire installation directory!" )
    endif()
endif()

if(UNIX)
    if(APPLE)
        # CPU
        set(ArrayFire_CPU_LIBRARIES "${ArrayFire_DIR}/lib/libafcpu.dylib")
        # OpenCL
        set(ArrayFire_OpenCL_LIBRARIES "${ArrayFire_DIR}/lib/libafopencl.dylib")
        # CUDA
        set(ArrayFire_CUDA_LIBRARIES "${ArrayFire_DIR}/lib/libafcuda.dylib")
    else()
        # CPU
        set(ArrayFire_CPU_LIBRARIES "${ArrayFire_DIR}/lib/libafcpu.so")
        # OpenCL
        set(ArrayFire_OpenCL_LIBRARIES "${ArrayFire_DIR}/lib/libafopencl.so")
        # CUDA
        set(ArrayFire_CUDA_LIBRARIES "${ArrayFire_DIR}/lib/libafcuda.so")
    endif()
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fPIC")
elseif(WIN32)
    add_definitions("/W3 /D_CRT_SECURE_NO_WARNINGS /wd4005 /wd4996 /wd4251 /wd4244 /nologo")
    # CPU
    set(ArrayFire_CPU_LIBRARIES "${ArrayFire_DIR}/lib/afcpu.lib")
    # OpenCL
    set(ArrayFire_OpenCL_LIBRARIES "${ArrayFire_DIR}/lib/afopencl.lib")
    # CUDA
    set(ArrayFire_CUDA_LIBRARIES "${ArrayFire_DIR}/lib/afcuda.lib")
endif()

message(STATUS "ArrayFire Dir: ${ArrayFire_DIR}")

set(ArrayFire_INCLUDE_DIRS "${ArrayFire_DIR}/include")

include_directories(${CMAKE_JS_INC};${ArrayFire_INCLUDE_DIRS})

file(GLOB COMMON_SOURCE_FILES
    "src/fire.*"
    "src/ext.*"
    "src/symbols.*"
    "src/helpers.*"
    "src/guard.*"
    "src/worker.*"
    "src/arraywrapper.*"
    "src/createarray.*"
    "src/errors.*"
    "src/moveandreorderarray.*"
    "src/arrayhelperfunctions.*"
    "src/functionhelpers.*"
    "src/mathfunctions.*"
    "src/vectoralgorithms.*"
    "src/statistics.*"
    "src/computervision.*")

file(GLOB TRAN_SOURCE_FILES
    "src/device.*")

# Common

add_library(${PROJECT_NAME}_Common STATIC "${COMMON_SOURCE_FILES}")

# CPU

add_library(${PROJECT_NAME}_CPU SHARED "${TRAN_SOURCE_FILES};src/init/init_CPU.cpp")

set_target_properties(${PROJECT_NAME}_CPU PROPERTIES COMPILE_FLAGS -DCPU)

set_target_properties(${PROJECT_NAME}_CPU PROPERTIES PREFIX "" SUFFIX ".node")

target_link_libraries(${PROJECT_NAME}_CPU "${CMAKE_JS_LIB};${ArrayFire_CPU_LIBRARIES};${PROJECT_NAME}_Common")

# OpenCL

add_library(${PROJECT_NAME}_OpenCL SHARED "${TRAN_SOURCE_FILES};src/init/init_OpenCL.cpp")

set_target_properties(${PROJECT_NAME}_OpenCL PROPERTIES PREFIX "" SUFFIX ".node")

target_link_libraries(${PROJECT_NAME}_OpenCL "${CMAKE_JS_LIB};${ArrayFire_OpenCL_LIBRARIES};${PROJECT_NAME}_Common")

# CUDA

add_library(${PROJECT_NAME}_CUDA SHARED "${TRAN_SOURCE_FILES};src/init/init_CUDA.cpp")

set_target_properties(${PROJECT_NAME}_CUDA PROPERTIES PREFIX "" SUFFIX ".node")

target_link_libraries(${PROJECT_NAME}_CUDA "${CMAKE_JS_LIB};${ArrayFire_CUDA_LIBRARIES};${PROJECT_NAME}_Common")
