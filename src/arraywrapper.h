/*
Copyright (c) 2014-2015, ArrayFire
Copyright (c) 2015 Gábor Mező aka unbornchikken (gabor.mezo@outlook.com)
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright notice, this
  list of conditions and the following disclaimer in the documentation and/or
  other materials provided with the distribution.

 * Neither the name of the ArrayFire nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

#ifndef ARRAY_ARRAYFIRE_JS_ARRAYWRAPPER_H
#define ARRAY_ARRAYFIRE_JS_ARRAYWRAPPER_H

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

    static af::array* GetArray(v8::Local<v8::Value> value);
    static af::array* TryGetArray(v8::Local<v8::Value> value);
    static af::array* GetArray(v8::Local<v8::Object> value);
    static af::array* TryGetArray(v8::Local<v8::Object> value);
    static af::array* GetArrayAt(const v8::FunctionCallbackInfo<v8::Value>& args, int index);
    static af::array* TryGetArrayAt(const v8::FunctionCallbackInfo<v8::Value>& args, int index);

    static NAN_METHOD(Create);
    static NAN_METHOD(Elements);
    static NAN_METHOD(Host);
    static NAN_METHOD(Scalar);
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
    static NAN_METHOD(AddAssign);
    static NAN_METHOD(SubAssign);    
    static NAN_METHOD(MulAssign);    
    static NAN_METHOD(DivAssign);

    static NAN_METHOD(Div);
    static NAN_METHOD(Mul);
    static NAN_METHOD(Sub);
    static NAN_METHOD(Add);
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

    af::array* _array;
};

#endif // ARRAY_ARRAYFIRE_JS_ARRAYWRAPPER_H
