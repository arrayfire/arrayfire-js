/*
Copyright 2015 Gábor Mező aka unbornchikken

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

#ifndef FIRE_JS_HELPERS_H
#define FIRE_JS_HELPERS_H

#include <utility>
#include <arrayfire.h>
#include <nan.h>
#include <complex>
#include "errors.h"

std::pair<af::dtype, unsigned> GetDTypeInfo(unsigned udtype);

std::pair<af::dtype, unsigned> GetDTypeInfo(v8::Local<v8::Value> value);

std::string ErrToString(af_err);

v8::Local<v8::Object> WrapPointer(void* ptr);

af::dim4 ToDim4(v8::Local<v8::Object> obj);

af::dim4 ToDim4(v8::Local<v8::Value> value);

af::seq ToSeq(v8::Local<v8::Object> obj);

af::seq ToSeq(v8::Local<v8::Value> value);

af::index ToIndex(v8::Local<v8::Value> value);

af::af_cdouble ToDComplex(v8::Local<v8::Object> obj);

af::af_cdouble  ToDComplex(v8::Local<v8::Value> value);

af::af_cfloat  ToFComplex(v8::Local<v8::Object> obj);

af::af_cfloat ToFComplex(v8::Local<v8::Value> value);

std::pair<af::dim4, af::dtype> ParseDimAndTypeArgs(const v8::FunctionCallbackInfo<v8::Value>& args, int assumedArgsLength = -1, int argsFollowingDims = 0, int dimsStartAt = 0);

#define ARGS_LEN(n) if (args.Length() < n) return NAN_THROW_INVALID_NO_OF_ARGS();

#define FIRE_ASYNC_METHOD_ARR(F, f)\
NAN_METHOD(F)\
{\
    NanScope();\
    \
    try\
    {\
        ARGS_LEN(2);\
        \
        af::array array = *ArrayWrapper::GetArrayAt(args, 0);\
        \
        return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(std::move(af::f(array))); });\
    }\
    FIRE_CATCH\
}

#define FIRE_ASYNC_METHOD_ARR_ARR(F, f)\
NAN_METHOD(F)\
{\
    NanScope();\
    \
    try\
    {\
        ARGS_LEN(3);\
        \
        af::array array1 = *ArrayWrapper::GetArrayAt(args, 0);\
        af::array array2 = *ArrayWrapper::GetArrayAt(args, 1);\
        \
        return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(std::move(af::f(array1, array2))); });\
    }\
    FIRE_CATCH\
}

#define FIRE_ASYNC_METHOD_ARR_ARR_(F, f)\
NAN_METHOD(F)\
{\
    NanScope();\
    \
    try\
    {\
        ARGS_LEN(3);\
        \
        af::array array1 = *ArrayWrapper::GetArrayAt(args, 0);\
        af::array array2 = *ArrayWrapper::GetArrayAt(args, 1);\
        \
        return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(std::move(f(array1, array2))); });\
    }\
    FIRE_CATCH\
}

#define FIRE_ASYNC_METHOD_ARR_DOUBLE_COMB(F, f)\
NAN_METHOD(F)\
{\
    NanScope();\
    try\
    {\
        ARGS_LEN(3)\
        \
        auto pArray1 = ArrayWrapper::TryGetArrayAt(args, 0);\
        auto pArray2 = ArrayWrapper::TryGetArrayAt(args, 1);\
        if (pArray1)\
        {\
            auto array1 = *pArray1;\
            if (pArray2)\
            {\
                auto array2 = *pArray2;\
                return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(af::f(array1, array2)); });\
            }\
            else if (args[1]->IsNumber())\
            {\
                double d = args[1]->NumberValue();\
                return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(af::f(array1, d)); });\
            }\
        }\
        else if (args[0]->IsNumber())\
        {\
            double d = args[0]->NumberValue();\
            if (pArray2)\
            {\
                auto array2 = *pArray2;\
                return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(af::f(d, array2)); });\
            }\
        }\
        \
        NAN_THROW_INVALID_ARGS();\
    }\
    FIRE_CATCH\
}

#endif // FIRE_JS_HELPERS_H
