#ifndef ARRAY_FIRE_JS_ARRAYWRAPPER_H
#define ARRAY_FIRE_JS_ARRAYWRAPPER_H

#include <nan.h>
#include <arrayfire.h>
#include <functional>

struct ArrayWrapper : public node::ObjectWrap
{
    ArrayWrapper(const ArrayWrapper&) = delete;
    ~ArrayWrapper();

    static void Init(v8::Local<v8::Object> exports);
    static v8::Local<v8::Object> New(af::array* array);
    static void NewAsync(const v8::FunctionCallbackInfo<v8::Value>& args, const std::function<af::array*()>& arrayFactory);
    static af::array* GetArray(v8::Local<v8::Value> value);
    static af::array* GetArrayAt(const v8::FunctionCallbackInfo<v8::Value>& args, int index);
    static af::array* TryGetArray(v8::Local<v8::Value> value);
    static af::array* TryGetArrayAt(const v8::FunctionCallbackInfo<v8::Value>& args, int index);

    static NAN_METHOD(Create);
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
    static NAN_METHOD(At);
    static NAN_METHOD(Set);

private:
    explicit ArrayWrapper(af::array* array);

    template<typename T>
    static af::array* CreateArray(void* ptr, af::af_source_t src, const af::dim4& dim4);
    static void New(const v8::FunctionCallbackInfo<v8::Value>& args);

    static v8::Persistent<v8::Function> constructor;

    af::array* array;
};

#endif // ARRAY_FIRE_JS_ARRAYWRAPPER_H
