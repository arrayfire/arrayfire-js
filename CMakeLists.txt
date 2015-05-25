cmake_minimum_required(VERSION 2.8)

project (arrayfire_js)

set(ArrayFire_DIR "${CMAKE_CURRENT_LIST_DIR}/deps/arrayfire/arrayfire-3.0beta-Linux")
set(ArrayFire_INCLUDE_DIRS "${ArrayFire_DIR}/include")

include_directories(${CMAKE_JS_INC};${ArrayFire_INCLUDE_DIRS})

file(GLOB SOURCE_FILES "src/*.cpp" "src/*.h")

# CPU

set(ArrayFire_CPU_LIBRARIES "${ArrayFire_DIR}/lib/libafcpu.so")

add_library(${PROJECT_NAME}_CPU SHARED ${SOURCE_FILES};src/init/init_CPU.cpp)

set_target_properties(${PROJECT_NAME}_CPU PROPERTIES PREFIX "" SUFFIX ".node")

target_link_libraries(${PROJECT_NAME}_CPU ${CMAKE_JS_LIB};${ArrayFire_CPU_LIBRARIES})

# OpenCL

set(ArrayFire_OpenCL_LIBRARIES "${ArrayFire_DIR}/lib/libafopencl.so")

add_library(${PROJECT_NAME}_OpenCL SHARED ${SOURCE_FILES};src/init/init_OpenCL.cpp)

set_target_properties(${PROJECT_NAME}_OpenCL PROPERTIES PREFIX "" SUFFIX ".node")

target_link_libraries(${PROJECT_NAME}_OpenCL ${CMAKE_JS_LIB};${ArrayFire_OpenCL_LIBRARIES})

# CUDA

set(ArrayFire_CUDA_LIBRARIES "${ArrayFire_DIR}/lib/libafcuda.so")

add_library(${PROJECT_NAME}_CUDA SHARED ${SOURCE_FILES};src/init/init_CUDA.cpp)

set_target_properties(${PROJECT_NAME}_CUDA PROPERTIES PREFIX "" SUFFIX ".node")

target_link_libraries(${PROJECT_NAME}_CUDA ${CMAKE_JS_LIB};${ArrayFire_CUDA_LIBRARIES})
