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

#endif // FIRE_JS_HELPERS_H
