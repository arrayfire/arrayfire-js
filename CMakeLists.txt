cmake_minimum_required(VERSION 2.8)

project (arrayfire_js)

if(UNIX)
    if(APPLE)
    else()
        set(ArrayFire_DIR "${CMAKE_CURRENT_LIST_DIR}/deps/arrayfire/arrayfire-3.0beta-Linux")
        # CPU
        set(ArrayFire_CPU_LIBRARIES "${ArrayFire_DIR}/lib/libafcpu.so")
        # OpenCL
        set(ArrayFire_OpenCL_LIBRARIES "${ArrayFire_DIR}/lib/libafopencl.so")
        # CUDA
        set(ArrayFire_CUDA_LIBRARIES "${ArrayFire_DIR}/lib/libafcuda.so")
    endif()
elseif(WIN32)
    add_definitions("/W3 /D_CRT_SECURE_NO_WARNINGS /wd4005 /wd4996 /wd4251 /nologo")
    set(ArrayFire_DIR "${CMAKE_CURRENT_LIST_DIR}/deps/arrayfire/arrayfire-3.0beta-Windows")
    # CPU
    set(ArrayFire_CPU_LIBRARIES "${ArrayFire_DIR}/lib/afcpu.lib")
    # OpenCL
    set(ArrayFire_OpenCL_LIBRARIES "${ArrayFire_DIR}/lib/afopencl.lib")
    # CUDA
    set(ArrayFire_CUDA_LIBRARIES "${ArrayFire_DIR}/lib/afcuda.lib")
endif()

set(ArrayFire_INCLUDE_DIRS "${ArrayFire_DIR}/include")

include_directories(${CMAKE_JS_INC};${ArrayFire_INCLUDE_DIRS})

file(GLOB SOURCE_FILES "src/*.cpp" "src/*.h")

# CPU

add_library(${PROJECT_NAME}_CPU SHARED ${SOURCE_FILES};src/init/init_CPU.cpp)

set_target_properties(${PROJECT_NAME}_CPU PROPERTIES COMPILE_FLAGS -DCPU)

set_target_properties(${PROJECT_NAME}_CPU PROPERTIES PREFIX "" SUFFIX ".node")

target_link_libraries(${PROJECT_NAME}_CPU ${CMAKE_JS_LIB};${ArrayFire_CPU_LIBRARIES})

# OpenCL

add_library(${PROJECT_NAME}_OpenCL SHARED ${SOURCE_FILES};src/init/init_OpenCL.cpp)

set_target_properties(${PROJECT_NAME}_OpenCL PROPERTIES PREFIX "" SUFFIX ".node")

target_link_libraries(${PROJECT_NAME}_OpenCL ${CMAKE_JS_LIB};${ArrayFire_OpenCL_LIBRARIES})

# CUDA

add_library(${PROJECT_NAME}_CUDA SHARED ${SOURCE_FILES};src/init/init_CUDA.cpp)

set_target_properties(${PROJECT_NAME}_CUDA PROPERTIES PREFIX "" SUFFIX ".node")

target_link_libraries(${PROJECT_NAME}_CUDA ${CMAKE_JS_LIB};${ArrayFire_CUDA_LIBRARIES})
