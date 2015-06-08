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
    static v8::Local<v8::Object> New(const af::array& array);
    static void NewAsync(const v8::FunctionCallbackInfo<v8::Value>& args, const std::function<af::array*()>& arrayFactory);
    static af::array* GetArray(v8::Local<v8::Value>& value);
    static af::array* TryGetArray(v8::Local<v8::Value>& value);
    static af::array* GetArray(v8::Local<v8::Object>& value);
    static af::array* TryGetArray(v8::Local<v8::Object>& value);
    static af::array* GetArrayAt(const v8::FunctionCallbackInfo<v8::Value>& args, int index);
    static af::array* TryGetArrayAt(const v8::FunctionCallbackInfo<v8::Value>& args, int index);

    static NAN_METHOD(Create);
    static NAN_METHOD(Elements);
    static NAN_METHOD(Host);
    static NAN_METHOD(Write);
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
    static NAN_METHOD(Row);
    static NAN_METHOD(Col);
    static NAN_METHOD(Slice);
    static NAN_METHOD(Rows);
    static NAN_METHOD(Cols);
    static NAN_METHOD(Slices);
    static NAN_METHOD(As);
    static NAN_METHOD(Assign);

    static NAN_METHOD(Add);
    static NAN_METHOD(AddAssign);
    static NAN_METHOD(Sub);
    static NAN_METHOD(SubAssign);
    static NAN_METHOD(Mul);
    static NAN_METHOD(MulAssign);
    static NAN_METHOD(Div);
    static NAN_METHOD(DivAssign);
    static NAN_METHOD(BitShiftL);
    static NAN_METHOD(BitShiftR);

    static NAN_METHOD(Lt);
    static NAN_METHOD(Gt);
    static NAN_METHOD(Le);
    static NAN_METHOD(Ge);
    static NAN_METHOD(Eq);
    static NAN_METHOD(Neq);
    static NAN_METHOD(And);
    static NAN_METHOD(Or);
    static NAN_METHOD(Not);
    static NAN_METHOD(Neg);
    static NAN_METHOD(BitAnd);
    static NAN_METHOD(BitOr);
    static NAN_METHOD(BitXor);

private:
    explicit ArrayWrapper(af::array* array);

    template<typename T>
    static af::array* CreateArray(void* ptr, af_source src, const af::dim4& dim4);
    static void New(const v8::FunctionCallbackInfo<v8::Value>& args);

    static v8::Persistent<v8::Function> constructor;

    af::array* array;
};

#endif // ARRAY_FIRE_JS_ARRAYWRAPPER_H
