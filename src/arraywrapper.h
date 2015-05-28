#ifndef ARRAY_FIRE_JS_ARRAYWRAPPER_H
#define ARRAY_FIRE_JS_ARRAYWRAPPER_H

#include <nan.h>
#include <arrayfire.h>

struct ArrayWrapper : public node::ObjectWrap
{
    static void Init(v8::Local<v8::Object> exports);
    static v8::Local<v8::Object> New(const af::array& array);
    static v8::Local<v8::Object> New(af::array&& array);

    static NAN_METHOD(Elements);
    static NAN_METHOD(Host);
    static NAN_METHOD(Type);
    static NAN_METHOD(Dims);
    static NAN_METHOD(NumDims);
    static NAN_METHOD(Bytes);
    static NAN_METHOD(Copy);
    static NAN_METHOD(IsEmpty);
    static NAN_METHOD(IsScalar);
    static NAN_METHOD(IsVector);
    static NAN_METHOD(IsRow);
    static NAN_METHOD(IsColumn);
    static NAN_METHOD(IsComplex);
    static NAN_METHOD(IsReal);
    static NAN_METHOD(IsDouble);
    static NAN_METHOD(IsSingle);
    static NAN_METHOD(IsRealFloating);
    static NAN_METHOD(IsFloating);
    static NAN_METHOD(IsInteger);
    static NAN_METHOD(IsBool);
    static NAN_METHOD(Eval);

private:
    explicit ArrayWrapper();
    explicit ArrayWrapper(const af::array& array);
    explicit ArrayWrapper(af::array&& array);

    static void New(const v8::FunctionCallbackInfo<v8::Value>& args);

    static v8::Persistent<v8::Function> constructor;

    af::array array;
};

#endif // ARRAY_FIRE_JS_ARRAYWRAPPER_H
