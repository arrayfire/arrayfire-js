#ifndef FIRE_JS_HELPERS_H
#define FIRE_JS_HELPERS_H

#include <utility>
#include <arrayfire.h>
#include <nan.h>
#include <complex>

std::pair<af::dtype, unsigned> GetDTypeInfo(unsigned udtype);

std::string ErrToString(af_err);

v8::Local<v8::Object> WrapPointer(void* ptr);

af::dim4 ToDim4(v8::Local<v8::Object> obj);

af::dim4 ToDim4(v8::Local<v8::Value> obj);

af::seq ToSeq(v8::Local<v8::Object> obj);

af::seq ToSeq(v8::Local<v8::Value> obj);

std::complex<double> ToDComplex(v8::Local<v8::Object> obj);

std::complex<double> ToDComplex(v8::Local<v8::Value> obj);

std::complex<float> ToFComplex(v8::Local<v8::Object> obj);

std::complex<float> ToFComplex(v8::Local<v8::Value> obj);

std::pair<af::dim4, af::dtype> ParseDimAndTypeArgs(const v8::FunctionCallbackInfo<v8::Value>& args, int assumedArgsLength = -1, int argsFollowingDims = 0, int dimsStartAt = 0);

#endif // FIRE_JS_HELPERS_H
