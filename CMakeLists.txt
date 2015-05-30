cmake_minimum_required(VERSION 2.8)

project (fire_js)

set(ArrayFire_DIR $ENV{AF_PATH})

if (NOT ArrayFire_DIR)
    message(FATAL_ERROR "Cannot locate ArrayFire installation. Please set AF_PATH!" )
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
    add_definitions("/W3 /D_CRT_SECURE_NO_WARNINGS /wd4005 /wd4996 /wd4251 /nologo")
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
    "src/helpers.*"
    "src/guard.*"
    "src/worker.*"
    "src/arraywrapper.*"
    "src/createarray.*")

file(GLOB TRAN_SOURCE_FILES
    "src/device.*")

# Common

add_library(${PROJECT_NAME}_Common STATIC ${COMMON_SOURCE_FILES})

# CPU

add_library(${PROJECT_NAME}_CPU SHARED ${TRAN_SOURCE_FILES};src/init/init_CPU.cpp)

set_target_properties(${PROJECT_NAME}_CPU PROPERTIES COMPILE_FLAGS -DCPU)

set_target_properties(${PROJECT_NAME}_CPU PROPERTIES PREFIX "" SUFFIX ".node")

target_link_libraries(${PROJECT_NAME}_CPU ${CMAKE_JS_LIB};${ArrayFire_CPU_LIBRARIES};${PROJECT_NAME}_Common)

# OpenCL

add_library(${PROJECT_NAME}_OpenCL SHARED ${TRAN_SOURCE_FILES};src/init/init_OpenCL.cpp)

set_target_properties(${PROJECT_NAME}_OpenCL PROPERTIES PREFIX "" SUFFIX ".node")

target_link_libraries(${PROJECT_NAME}_OpenCL ${CMAKE_JS_LIB};${ArrayFire_OpenCL_LIBRARIES};${PROJECT_NAME}_Common)

# CUDA

add_library(${PROJECT_NAME}_CUDA SHARED ${TRAN_SOURCE_FILES};src/init/init_CUDA.cpp)

set_target_properties(${PROJECT_NAME}_CUDA PROPERTIES PREFIX "" SUFFIX ".node")

target_link_libraries(${PROJECT_NAME}_CUDA ${CMAKE_JS_LIB};${ArrayFire_CUDA_LIBRARIES};${PROJECT_NAME}_Common)
