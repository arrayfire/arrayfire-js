#ifndef FIRE_JS_HELPERS_H
#define FIRE_JS_HELPERS_H

#include <utility>
#include <arrayfire.h>
#include <nan.h>

#define FIRE_CATCH catch(std::exception &ex) { return NanThrowError(ex.what()); } catch(...) { return NanThrowError("Unknown error!"); }

std::pair<af::dtype, unsigned> ConvDtype(unsigned udtype);

std::string ErrToString(af_err);

v8::Local<v8::Object> WrapPointer(void* ptr);

af::dim4 ToDim4(v8::Local<v8::Object> obj);

#endif // FIRE_JS_HELPERS_H
