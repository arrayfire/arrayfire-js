#ifndef ARRAY_FIRE_JS_HELPERS_H
#define ARRAY_FIRE_JS_HELPERS_H

#include <utility>
#include <arrayfire.h>
#include <nan.h>

std::pair<af::dtype, unsigned> ConvDtype(unsigned udtype);

std::string ErrToString(af_err);

v8::Local<v8::Object> WrapPointer(void* ptr);

#endif // ARRAY_FIRE_JS_HELPERS_H