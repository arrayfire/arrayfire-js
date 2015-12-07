
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

#include "ext.h"
#include "arraywrapper.h"
#include "helpers.h"
#include "guard.h"
#include "worker.h"
#include "errors.h"
#include "symbols.h"

using namespace v8;
using namespace std;
using namespace node;

Nan::Persistent<Function> ArrayWrapper::constructor;

int GetMemSize(const af::array* array)
{
    // Make GC aware of device memory.
    // Event it's VRAM this should keep the usage on low (few hundred megabytes),
    // so we won't triggrer out of memory errors.
    // TODO: If ArrayFire's CUDA error handling gets fixed,
    // TODO: then we should only report memory usage for CPU based devices.
    return static_cast<int>(sizeof(af::array)) + static_cast<int>(sizeof(ArrayWrapper)) + static_cast<int>(array->bytes());
}

ArrayWrapper::ArrayWrapper(af::array* array) :
    _array(array)
{
    assert(array);
    Nan::AdjustExternalMemory(GetMemSize(array));
}

ArrayWrapper::~ArrayWrapper()
{
    Free();
}

void ArrayWrapper::Free()
{
    if (_array)
    {
        Nan::AdjustExternalMemory(-GetMemSize(_array));
        delete _array;
        _array = nullptr;
    }
}

NAN_MODULE_INIT(ArrayWrapper::Init)
{
    Nan::HandleScope scope;

    auto tmpl = Nan::New<FunctionTemplate>(New);
    tmpl->SetClassName(Nan::New("AFArray").ToLocalChecked());

    int noOfMethods = 21;
    tmpl->InstanceTemplate()->SetInternalFieldCount(noOfMethods);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("free").ToLocalChecked(), Nan::New<FunctionTemplate>(V8Free), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("elements").ToLocalChecked(), Nan::New<FunctionTemplate>(Elements), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("host").ToLocalChecked(), Nan::New<FunctionTemplate>(Host), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("copyToHost").ToLocalChecked(), Nan::New<FunctionTemplate>(Host), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("scalar").ToLocalChecked(), Nan::New<FunctionTemplate>(Scalar), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("value").ToLocalChecked(), Nan::New<FunctionTemplate>(Scalar), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("write").ToLocalChecked(), Nan::New<FunctionTemplate>(Write), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("type").ToLocalChecked(), Nan::New<FunctionTemplate>(Type), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("dims").ToLocalChecked(), Nan::New<FunctionTemplate>(Dims), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("numdims").ToLocalChecked(), Nan::New<FunctionTemplate>(NumDims), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("numDims").ToLocalChecked(), Nan::New<FunctionTemplate>(NumDims), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("bytes").ToLocalChecked(), Nan::New<FunctionTemplate>(Bytes), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("copy").ToLocalChecked(), Nan::New<FunctionTemplate>(Copy), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("isempty").ToLocalChecked(), Nan::New<FunctionTemplate>(IsEmpty), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("isEmpty").ToLocalChecked(), Nan::New<FunctionTemplate>(IsEmpty), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("isscalar").ToLocalChecked(), Nan::New<FunctionTemplate>(IsScalar), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("isScalar").ToLocalChecked(), Nan::New<FunctionTemplate>(IsScalar), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("isvector").ToLocalChecked(), Nan::New<FunctionTemplate>(IsVector), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("isVector").ToLocalChecked(), Nan::New<FunctionTemplate>(IsVector), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("isrow").ToLocalChecked(), Nan::New<FunctionTemplate>(IsRow), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("isRow").ToLocalChecked(), Nan::New<FunctionTemplate>(IsRow), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("iscolumn").ToLocalChecked(), Nan::New<FunctionTemplate>(IsColumn), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("isColumn").ToLocalChecked(), Nan::New<FunctionTemplate>(IsColumn), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("iscomplex").ToLocalChecked(), Nan::New<FunctionTemplate>(IsComplex), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("isComplex").ToLocalChecked(), Nan::New<FunctionTemplate>(IsComplex), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("isreal").ToLocalChecked(), Nan::New<FunctionTemplate>(IsReal), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("isReal").ToLocalChecked(), Nan::New<FunctionTemplate>(IsReal), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("isdouble").ToLocalChecked(), Nan::New<FunctionTemplate>(IsDouble), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("isDouble").ToLocalChecked(), Nan::New<FunctionTemplate>(IsDouble), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("issingle").ToLocalChecked(), Nan::New<FunctionTemplate>(IsSingle), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("isSingle").ToLocalChecked(), Nan::New<FunctionTemplate>(IsSingle), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("isrealfloating").ToLocalChecked(), Nan::New<FunctionTemplate>(IsRealFloating), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("isRealFloating").ToLocalChecked(), Nan::New<FunctionTemplate>(IsRealFloating), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("isfloating").ToLocalChecked(), Nan::New<FunctionTemplate>(IsFloating), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("isFloating").ToLocalChecked(), Nan::New<FunctionTemplate>(IsFloating), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("isinteger").ToLocalChecked(), Nan::New<FunctionTemplate>(IsInteger), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("isInteger").ToLocalChecked(), Nan::New<FunctionTemplate>(IsInteger), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("isbool").ToLocalChecked(), Nan::New<FunctionTemplate>(IsBool), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("isBool").ToLocalChecked(), Nan::New<FunctionTemplate>(IsBool), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("eval").ToLocalChecked(), Nan::New<FunctionTemplate>(Eval), v8::None);

    Nan::SetPrototypeTemplate(tmpl, Nan::New("at").ToLocalChecked(), Nan::New<FunctionTemplate>(At), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("row").ToLocalChecked(), Nan::New<FunctionTemplate>(Row), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("col").ToLocalChecked(), Nan::New<FunctionTemplate>(Col), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("slice").ToLocalChecked(), Nan::New<FunctionTemplate>(Slice), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("rows").ToLocalChecked(), Nan::New<FunctionTemplate>(Rows), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("cols").ToLocalChecked(), Nan::New<FunctionTemplate>(Cols), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("slices").ToLocalChecked(), Nan::New<FunctionTemplate>(Slices), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("as").ToLocalChecked(), Nan::New<FunctionTemplate>(As), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("assign").ToLocalChecked(), Nan::New<FunctionTemplate>(Assign), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("set").ToLocalChecked(), Nan::New<FunctionTemplate>(Assign), v8::None);

    Nan::SetPrototypeTemplate(tmpl, Nan::New("add").ToLocalChecked(), Nan::New<FunctionTemplate>(Add), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("addAssign").ToLocalChecked(), Nan::New<FunctionTemplate>(AddAssign), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("sub").ToLocalChecked(), Nan::New<FunctionTemplate>(Sub), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("subAssign").ToLocalChecked(), Nan::New<FunctionTemplate>(SubAssign), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("mul").ToLocalChecked(), Nan::New<FunctionTemplate>(Mul), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("mulAssign").ToLocalChecked(), Nan::New<FunctionTemplate>(MulAssign), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("div").ToLocalChecked(), Nan::New<FunctionTemplate>(Div), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("divAssign").ToLocalChecked(), Nan::New<FunctionTemplate>(DivAssign), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("bitshiftl").ToLocalChecked(), Nan::New<FunctionTemplate>(BitShiftL), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("bitShiftL").ToLocalChecked(), Nan::New<FunctionTemplate>(BitShiftL), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("bitshiftr").ToLocalChecked(), Nan::New<FunctionTemplate>(BitShiftR), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("bitShiftR").ToLocalChecked(), Nan::New<FunctionTemplate>(BitShiftR), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("lt").ToLocalChecked(), Nan::New<FunctionTemplate>(Lt), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("gt").ToLocalChecked(), Nan::New<FunctionTemplate>(Gt), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("le").ToLocalChecked(), Nan::New<FunctionTemplate>(Le), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("ge").ToLocalChecked(), Nan::New<FunctionTemplate>(Ge), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("eq").ToLocalChecked(), Nan::New<FunctionTemplate>(Eq), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("neq").ToLocalChecked(), Nan::New<FunctionTemplate>(Neq), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("and").ToLocalChecked(), Nan::New<FunctionTemplate>(And), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("or").ToLocalChecked(), Nan::New<FunctionTemplate>(Or), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("bitAnd").ToLocalChecked(), Nan::New<FunctionTemplate>(BitAnd), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("bitOr").ToLocalChecked(), Nan::New<FunctionTemplate>(BitOr), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("bitXor").ToLocalChecked(), Nan::New<FunctionTemplate>(BitXor), v8::None);

    Nan::SetPrototypeTemplate(tmpl, Nan::New("rhsAdd").ToLocalChecked(), Nan::New<FunctionTemplate>(RhsAdd), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("rhsSub").ToLocalChecked(), Nan::New<FunctionTemplate>(RhsSub), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("rhsMul").ToLocalChecked(), Nan::New<FunctionTemplate>(RhsMul), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("rhsDiv").ToLocalChecked(), Nan::New<FunctionTemplate>(RhsDiv), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("rhsBitshiftl").ToLocalChecked(), Nan::New<FunctionTemplate>(RhsBitShiftL), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("rhsBitShiftL").ToLocalChecked(), Nan::New<FunctionTemplate>(RhsBitShiftL), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("rhsBitshiftr").ToLocalChecked(), Nan::New<FunctionTemplate>(RhsBitShiftR), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("rhsBitShiftR").ToLocalChecked(), Nan::New<FunctionTemplate>(RhsBitShiftR), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("rhsLt").ToLocalChecked(), Nan::New<FunctionTemplate>(RhsLt), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("rhsGt").ToLocalChecked(), Nan::New<FunctionTemplate>(RhsGt), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("rhsLe").ToLocalChecked(), Nan::New<FunctionTemplate>(RhsLe), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("rhsGe").ToLocalChecked(), Nan::New<FunctionTemplate>(RhsGe), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("rhsEq").ToLocalChecked(), Nan::New<FunctionTemplate>(RhsEq), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("rhsNeq").ToLocalChecked(), Nan::New<FunctionTemplate>(RhsNeq), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("rhsAnd").ToLocalChecked(), Nan::New<FunctionTemplate>(RhsAnd), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("rhsOr").ToLocalChecked(), Nan::New<FunctionTemplate>(RhsOr), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("rhsBitAnd").ToLocalChecked(), Nan::New<FunctionTemplate>(RhsBitAnd), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("rhsBitOr").ToLocalChecked(), Nan::New<FunctionTemplate>(RhsBitOr), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("rhsBitXor").ToLocalChecked(), Nan::New<FunctionTemplate>(RhsBitXor), v8::None);

    Nan::SetPrototypeTemplate(tmpl, Nan::New("neg").ToLocalChecked(), Nan::New<FunctionTemplate>(Neg), v8::None);
    Nan::SetPrototypeTemplate(tmpl, Nan::New("not").ToLocalChecked(), Nan::New<FunctionTemplate>(Not), v8::None);

    auto f = tmpl->GetFunction();
    f->Set(Nan::New("create").ToLocalChecked(), Nan::New<FunctionTemplate>(Create)->GetFunction());
    constructor.Reset(f);
    Nan::Set(target, Nan::New<String>("AFArray").ToLocalChecked(), f);
}

v8::Local<Object> ArrayWrapper::New(const af::array& array)
{
    return New(new af::array(array));
}

v8::Local<v8::Object> ArrayWrapper::New(af::array* array)
{
    Nan::EscapableHandleScope scope;
    assert(array);
    Local<Value> info[] = { WrapPointer(array) };
    auto c = Nan::New(constructor);
    auto inst = c->NewInstance(1, info);
    assert(ObjectWrap::Unwrap<ArrayWrapper>(inst)->_array == array);
    return scope.Escape(inst);
}

void ArrayWrapper::NewAsync(const Nan::FunctionCallbackInfo<v8::Value>& info, const std::function<af::array*()>& arrayFactory)
{
    if (info.Length() >= 1 && info[info.Length() - 1]->IsFunction())
    {
        auto callback = new Nan::Callback(info[info.Length() - 1].As<Function>());
        auto worker = new Worker<af::array*>(callback, arrayFactory, [](Worker<af::array*>* w, af::array* a){ return ArrayWrapper::New(a); });
        Nan::AsyncQueueWorker(worker);
        info.GetReturnValue().SetUndefined();
    }
    else
    {
        NAN_THROW("Last argument have to be a callback!");
    }
}

af::array* ArrayWrapper::GetArray(v8::Local<v8::Value> value)
{
    auto array = TryGetArray(value);
    if (array) return array;
    ARRAYFIRE_THROW("Argument is not an AFArray instance or wrapped array has been destroyed by calling its free() method.");
}

af::array* ArrayWrapper::TryGetArray(v8::Local<v8::Value> value)
{
    try
    {
        if (value->IsObject())
        {
            auto obj = value.As<Object>();
            if (obj->GetConstructorName()->Equals(Nan::New(Symbols::AFArrayClass)))
            {
                auto wrapper = ObjectWrap::Unwrap<ArrayWrapper>(value.As<Object>());
                return wrapper->_array;
            }
        }
    }
    catch (...)
    {
    }
    return nullptr;
}

af::array* ArrayWrapper::GetArray(v8::Local<v8::Object> value)
{
    auto array = TryGetArray(value);
    if (array) return array;
    ARRAYFIRE_THROW("Argument is not an AFArray instance or wrapped array has been destroyed by calling its free() method.");
}

af::array* ArrayWrapper::TryGetArray(v8::Local<v8::Object> value)
{
    try
    {
        auto wrapper = ObjectWrap::Unwrap<ArrayWrapper>(value.As<Object>());
        if (wrapper) return wrapper->_array;
    }
    catch (...)
    {
    }
    return nullptr;
}

af::array* ArrayWrapper::GetArrayAt(const Nan::FunctionCallbackInfo<v8::Value>& info, int index)
{
    auto array = TryGetArrayAt(info, index);
    if (array) return array;
    stringstream ss;
    ss << "Argument at position " << to_string(index) << ". is not an AFArray instance.";
    ARRAYFIRE_THROW(ss.str().c_str());
}

af::array* ArrayWrapper::TryGetArrayAt(const Nan::FunctionCallbackInfo<v8::Value>& info, int index)
{
    if (index < info.Length())
    {
        return TryGetArray(info[index]);
    }
    return nullptr;
}

void ArrayWrapper::New(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
    try
    {
        ArrayWrapper* instance = nullptr;
        try
        {
            if (info.Length() == 0)
            {
                Guard guard;
                instance = new ArrayWrapper(new af::array());
            }
            else if (info.Length() == 1)
            {
                if (Buffer::HasInstance(info[0]))
                {
                    instance = new ArrayWrapper(reinterpret_cast<af::array*>(Buffer::Data(info[0])));
                }
            }
            else
            {
                Guard guard;
                auto arr = TryGetArrayAt(info, 0);
                if (arr)
                {
                    auto dims = ToDim4(info[1]);
                    instance = new ArrayWrapper(new af::array(*arr, dims));
                }
                else
                {
                    auto dimAndType = ParseDimAndTypeArgs(info);
                    instance = new ArrayWrapper(new af::array(dimAndType.first, dimAndType.second));
                }
            }
        }
        catch (...)
        {
            delete instance;
            throw;
        }

        if (!instance)
        {
            return NAN_THROW("Invalid arguments.");
        }

        instance->Wrap(info.Holder());
        RegisterInTmp(info.Holder());
        info.GetReturnValue().Set(info.Holder());
    }
    ARRAYFIRE_CATCH
}

template<typename T>
af::array* ArrayWrapper::CreateArray(void* ptr, af_source src, const af::dim4& dim4)
{
    Guard guard;
    return new af::array(dim4, (T*)ptr, src);
}

NAN_METHOD(ArrayWrapper::V8Free)
{
    auto self = ObjectWrap::Unwrap<ArrayWrapper>(info.This());
    self->Free();
    info.GetReturnValue().SetUndefined();
}

NAN_METHOD(ArrayWrapper::Create)
{
    try
    {
        int buffIdx = -1;
        function<af::array*()> factory;

        for (int i = 0; i < info.Length(); i++)
        {
            if (Buffer::HasInstance(info[i]))
            {
                buffIdx = i;
                break;
            }
        }

        if (buffIdx == -1)
        {
            return NAN_THROW("Buffer argument expected.");
        }
        else if (buffIdx + 1 < info.Length())
        {
            // Copy / wrap ptr
            // info: dim0..dimn, dtype, ptr[, source]
            af_source src = afHost;
            if (buffIdx + 1 < info.Length() && info[buffIdx + 1]->IsNumber())
            {
                src = (af_source)(info[buffIdx + 2]->Int32Value());
            }
            auto buffObj = info[buffIdx]->ToObject();
            char* ptr = Buffer::Data(buffObj);
            auto dimAndType = ParseDimAndTypeArgs(info, buffIdx);
            switch (dimAndType.second)
            {
                case f32:
                    factory = [=]() { return CreateArray<float>(ptr, src, dimAndType.first); };
                    break;
                case f64:
                    factory = [=]() { return CreateArray<double>(ptr, src, dimAndType.first); };
                    break;
                case s32:
                    factory = [=]() { return CreateArray<int>(ptr, src, dimAndType.first); };
                    break;
                case u32:
                    factory = [=]() { return CreateArray<unsigned>(ptr, src, dimAndType.first); };
                    break;
                case u8:
                    factory = [=]() { return CreateArray<unsigned char>(ptr, src, dimAndType.first ); };
                    break;
                case c32:
                    factory = [=]() { return CreateArray<af::cfloat>(ptr, src, dimAndType.first); };
                    break;
                case c64:
                    factory = [=]() { return CreateArray<af::cdouble>(ptr, src, dimAndType.first); };
                    break;
                case b8:
                    factory = [=]() { return CreateArray<char>(ptr, src, dimAndType.first); };
                    break;
                case s64:
                    factory = [=]() { return CreateArray<int64_t>(ptr, src, dimAndType.first); };
                    break;
                case u64:
                    factory = [=]() { return CreateArray<uint64_t>(ptr, src, dimAndType.first); };
                    break;
                default:
                    assert(false);
            }
        }

        if (!factory)
        {
            return NAN_THROW_INVALID_ARGS();
        }

        auto conv = [](Worker<af::array*>* w, af::array* a)
        {
            return New(a);
        };
        auto worker = new Worker<af::array*>(GetCallback(info), move(factory), move(conv));
        worker->SaveToPersistent("data", info[buffIdx]->ToObject());

        Nan::AsyncQueueWorker(worker);
        info.GetReturnValue().SetUndefined();
    }
    ARRAYFIRE_CATCH
}

void ArrayWrapper::RegisterInTmp(v8::Local<v8::Object> instance)
{
    Local<Value> args[] = { instance };
    auto scope = Nan::New(constructor)->Get(Nan::New("scope").ToLocalChecked()).As<Object>();
    auto reg = scope->Get(Nan::New("register").ToLocalChecked());
    auto regF = reg.As<Object>().As<Function>();
    regF->Call(scope, 1, args);
}

NAN_METHOD(ArrayWrapper::Elements)
{
    try
    {
        Guard guard;
        info.GetReturnValue().Set(Nan::New<Number>(GetArray(info.This())->elements()));
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(ArrayWrapper::Host)
{
    try
    {
        ARGS_LEN(1)

        char* buffData;
        auto pArray = GetArray(info.This());

        if (Buffer::HasInstance(info[0]))
        {
            buffData = Buffer::Data(info[0]);

            if (Buffer::Length(info[0]) < pArray->bytes())
            {
                return NAN_THROW("Buffer is too small to hold values.");
            }

            af::array array(*pArray);
            auto exec = [=]()
            {
                Guard guard;
                array.host(buffData);
            };
            auto worker = new Worker<void>(GetCallback(info), move(exec));
            worker->SaveToPersistent("data", info[0]->ToObject());

            Nan::AsyncQueueWorker(worker);
            info.GetReturnValue().SetUndefined();
        }
        else
        {
            size_t size = pArray->elements() * GetDTypeInfo(pArray->type()).second;
            buffData = new char[size];
            try
            {
                af::array array(*pArray);
                auto exec = [=]()
                {
                    Guard guard;
                    array.host(buffData);
                    return buffData;
                };
                auto conv = [=](Worker<char*>* w, char* data)
                {
                    Nan::EscapableHandleScope scope;
                    return scope.Escape(Nan::NewBuffer(data, size, [](char* data, void* hint) { delete[] data; }, nullptr).ToLocalChecked());
                };
                auto worker = new Worker<char*>(GetCallback(info), move(exec), move(conv));
                Nan::AsyncQueueWorker(worker);
                info.GetReturnValue().SetUndefined();
            }
            catch (...)
            {
                delete[] buffData;
                throw;
            }
        }
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(ArrayWrapper::Scalar)
{
    try
    {
        ARGS_LEN(1)

        auto pArray = GetArray(info.This());
        af::array array(*pArray);
        switch (array.type())
        {
            case f32:
                {
                    auto exec = [=]()
                    {
                        Guard guard;
                        return array.scalar<float>();
                    };
                    auto worker = new Worker<float>(GetCallback(info), move(exec));
                    Nan::AsyncQueueWorker(worker);
                }
                break;
            case f64:
                {
                    auto exec = [=]()
                    {
                        Guard guard;
                        return array.scalar<double>();
                    };
                    auto worker = new Worker<double>(GetCallback(info), move(exec));
                    Nan::AsyncQueueWorker(worker);
                }
                break;
            case s32:
                {
                    auto exec = [=]()
                    {
                        Guard guard;
                        return array.scalar<int>();
                    };
                    auto worker = new Worker<int>(GetCallback(info), move(exec));
                    Nan::AsyncQueueWorker(worker);
                }
                break;
            case u32:
                {
                    auto exec = [=]()
                    {
                        Guard guard;
                        return array.scalar<unsigned>();
                    };
                    auto worker = new Worker<unsigned>(GetCallback(info), move(exec));
                    Nan::AsyncQueueWorker(worker);
                }
                break;
            case u8:
                {
                    auto exec = [=]()
                    {
                        Guard guard;
                        return array.scalar<unsigned char>();
                    };
                    auto worker = new Worker<unsigned char>(GetCallback(info), move(exec));
                    Nan::AsyncQueueWorker(worker);
                }
                break;
            case b8:
                {
                    auto exec = [=]()
                    {
                        Guard guard;
                        return array.scalar<char>();
                    };
                    auto worker = new Worker<char>(GetCallback(info), move(exec));
                    Nan::AsyncQueueWorker(worker);
                }
                break;
            case c32:
                {
                    auto exec = [=]()
                    {
                        Guard guard;
                        return array.scalar<af::cfloat>();
                    };
                    auto conv = [=](Worker<af::cfloat>* w, af::cfloat data)
                    {
                        return ToV8Complex(data);
                    };
                    auto worker = new Worker<af::cfloat>(GetCallback(info), move(exec), move(conv));
                    Nan::AsyncQueueWorker(worker);
                }
                break;
            case c64:
                {
                    auto exec = [=]()
                    {
                        Guard guard;
                        return array.scalar<af::cdouble>();
                    };
                    auto conv = [=](Worker<af::cdouble>* w, af::cdouble data)
                    {
                        return ToV8Complex(data);
                    };
                    auto worker = new Worker<af::cdouble>(GetCallback(info), move(exec), move(conv));
                    Nan::AsyncQueueWorker(worker);
                }
                break;
            case s64:
                {
                    auto exec = [=]()
                    {
                        Guard guard;
                        return array.scalar<long long>();
                    };
                    auto conv = [=](Worker<long long>* w, long long data)
                    {
                        Nan::EscapableHandleScope scope;
                        return scope.Escape(Nan::New(to_string(data).c_str()).ToLocalChecked());
                    };
                    auto worker = new Worker<long long>(GetCallback(info), move(exec), move(conv));
                    Nan::AsyncQueueWorker(worker);
                }
                break;
            case u64:
                {
                    auto exec = [=]()
                    {
                        Guard guard;
                        return array.scalar<unsigned long long>();
                    };
                    auto conv = [=](Worker<unsigned long long>* w, unsigned long long data)
                    {
                        Nan::EscapableHandleScope scope;
                        return scope.Escape(Nan::New(to_string(data).c_str()).ToLocalChecked());
                    };
                    auto worker = new Worker<unsigned long long>(GetCallback(info), move(exec), move(conv));
                    Nan::AsyncQueueWorker(worker);
                }
                break;
            default:
                assert(false);
        }
        info.GetReturnValue().SetUndefined();
    }
    ARRAYFIRE_CATCH
}


NAN_METHOD(ArrayWrapper::Write)
{
    try
    {
        ARGS_LEN(3)

        char* buffData;
        auto pArray = GetArray(info.This());

        if (Buffer::HasInstance(info[0]))
        {
            buffData = Buffer::Data(info[0]);
        }
        else
        {
            return NAN_THROW("First argument is no a Buffer.");
        }

        unsigned bytes = info[1]->Uint32Value();
        af_source src = afHost;
        if (info.Length() > 3)
        {
            src = (af_source)(info[2]->Int32Value());
        }

        af::array array(*pArray);
        auto exec = [=]()
        {
            Guard guard;
            af_write_array(array.get(), buffData, bytes, src);
        };
        auto worker = new Worker<void>(GetCallback(info), move(exec));
        worker->SaveToPersistent("data", info[0]->ToObject());

        Nan::AsyncQueueWorker(worker);
        info.GetReturnValue().SetUndefined();
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(ArrayWrapper::Type)
{
    try
    {
        info.GetReturnValue().Set(GetArray(info.This())->type());
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(ArrayWrapper::Dims)
{
    try
    {
        auto pArray = GetArray(info.This());
        if (!info.Length())
        {
            auto dims = pArray->dims();
            auto jsDims = Nan::New<Object>();
            jsDims->Set(Nan::New(Symbols::Elements), Nan::New<Number>(dims.elements()));
            jsDims->Set(Nan::New(Symbols::Ndims), Nan::New<Number>(dims.ndims()));
            jsDims->Set(Nan::New(Symbols::NDims), Nan::New<Number>(dims.ndims()));
            auto pDims = Nan::New<Array>(4);
            pDims->Set(0, Nan::New<Number>(dims[0]));
            pDims->Set(1, Nan::New<Number>(dims[1]));
            pDims->Set(2, Nan::New<Number>(dims[2]));
            pDims->Set(3, Nan::New<Number>(dims[3]));
            jsDims->Set(Nan::New(Symbols::Values), pDims);

            info.GetReturnValue().Set(jsDims);
        }
        else
        {
            info.GetReturnValue().Set(Nan::New<Number>(pArray->dims(info[0]->Uint32Value())));
        }
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(ArrayWrapper::NumDims)
{
    try
    {
        info.GetReturnValue().Set(Nan::New<Number>(GetArray(info.This())->numdims()));
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(ArrayWrapper::Bytes)
{
    try
    {
        info.GetReturnValue().Set(Nan::New<Number>((unsigned)GetArray(info.This())->bytes()));
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(ArrayWrapper::Copy)
{
    try
    {
        Guard guard;
        info.GetReturnValue().Set(New(GetArray(info.This())->copy()));
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsEmpty)
{
    try
    {
        info.GetReturnValue().Set(Nan::New(GetArray(info.This())->isempty()));
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsScalar)
{
    try
    {
        info.GetReturnValue().Set(Nan::New(GetArray(info.This())->isscalar()));
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsVector)
{
    try
    {
        info.GetReturnValue().Set(Nan::New(GetArray(info.This())->isvector()));
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsRow)
{
    try
    {
        info.GetReturnValue().Set(Nan::New(GetArray(info.This())->isrow()));
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsColumn)
{
    try
    {
        info.GetReturnValue().Set(Nan::New(GetArray(info.This())->iscolumn()));
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsComplex)
{


    try
    {
        info.GetReturnValue().Set(Nan::New(GetArray(info.This())->iscomplex()));
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsReal)
{


    try
    {
        info.GetReturnValue().Set(Nan::New(GetArray(info.This())->isreal()));
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsDouble)
{


    try
    {
        info.GetReturnValue().Set(Nan::New(GetArray(info.This())->isdouble()));
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsSingle)
{


    try
    {
        info.GetReturnValue().Set(Nan::New(GetArray(info.This())->issingle()));
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsRealFloating)
{


    try
    {
        info.GetReturnValue().Set(Nan::New(GetArray(info.This())->isrealfloating()));
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsFloating)
{


    try
    {
        info.GetReturnValue().Set(Nan::New(GetArray(info.This())->isfloating()));
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsInteger)
{


    try
    {
        info.GetReturnValue().Set(Nan::New(GetArray(info.This())->isinteger()));
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsBool)
{


    try
    {
        info.GetReturnValue().Set(Nan::New(GetArray(info.This())->type() == b8));
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(ArrayWrapper::Eval)
{


    try
    {
        Guard guard;
        GetArray(info.This())->eval();
        info.GetReturnValue().SetUndefined();
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(ArrayWrapper::At)
{
    // Aka "indexing"


    try
    {
        ARGS_LEN(1)

        Guard guard;

        if (info.Length() == 1)
        {
            auto ri = ToRegionIndex(info[0]);
            switch (get<0>(ri))
            {
                case Region::Row:
                    info.GetReturnValue().Set(New(GetArray(info.This())->row(get<1>(ri))));
                    break;
                case Region::Rows:
                    info.GetReturnValue().Set(New(GetArray(info.This())->rows(get<1>(ri), get<2>(ri))));
                    break;
                case Region::Col:
                    info.GetReturnValue().Set(New(GetArray(info.This())->col(get<1>(ri))));
                    break;
                case Region::Cols:
                    info.GetReturnValue().Set(New(GetArray(info.This())->cols(get<1>(ri), get<2>(ri))));
                    break;
                case Region::Slice:
                    info.GetReturnValue().Set(New(GetArray(info.This())->slice(get<1>(ri))));
                    break;
                case Region::Slices:
                    info.GetReturnValue().Set(New(GetArray(info.This())->slices(get<1>(ri), get<2>(ri))));
                    break;
                default:
                    info.GetReturnValue().Set(New(GetArray(info.This())->operator()(ToIndex(info[0]))));
                    break;
            }
        }
        else if (info.Length() == 2)
        {
            info.GetReturnValue().Set(New(GetArray(info.This())->operator()(ToIndex(info[0]), ToIndex(info[1]))));
        }
        else if (info.Length() == 3)
        {
            info.GetReturnValue().Set(New(GetArray(info.This())->operator()(ToIndex(info[0]), ToIndex(info[1]), ToIndex(info[2]))));
        }
        else
        {
            info.GetReturnValue().Set(New(GetArray(info.This())->operator()(ToIndex(info[0]), ToIndex(info[1]), ToIndex(info[2]), ToIndex(info[3]))));
        }
    }
    ARRAYFIRE_CATCH
}

#define AFARRAY_IMPL_IDX1(F, f)\
NAN_METHOD(ArrayWrapper::F)\
{\
    \
    try\
    {\
        ARGS_LEN(1)\
        Guard guard;\
        auto pArray = GetArray(info.This());\
        info.GetReturnValue().Set(New(pArray->f(info[0]->Int32Value())));\
    }\
    ARRAYFIRE_CATCH\
}

AFARRAY_IMPL_IDX1(Row, row)
AFARRAY_IMPL_IDX1(Col, col)
AFARRAY_IMPL_IDX1(Slice, slice)
#undef AFARRAY_IMPL_IDX1

#define AFARRAY_IMPL_IDX2(F, f)\
NAN_METHOD(ArrayWrapper::F)\
{\
    \
    try\
    {\
        ARGS_LEN(2);\
        Guard guard;\
        auto pArray = GetArray(info.This());\
        info.GetReturnValue().Set(New(pArray->f(info[0]->Int32Value(), info[1]->Int32Value())));\
    }\
    ARRAYFIRE_CATCH\
}

AFARRAY_IMPL_IDX2(Rows, rows)
AFARRAY_IMPL_IDX2(Cols, cols)
AFARRAY_IMPL_IDX2(Slices, slices)
#undef AFARRAY_IMPL_IDX2

NAN_METHOD(ArrayWrapper::As)
{

    try
    {
        ARGS_LEN(1);
        af::dtype type = GetDTypeInfo(info[0]->Uint32Value()).first;
        Guard guard;
        info.GetReturnValue().Set(New(GetArray(info.This())->as(type)));
    }
    ARRAYFIRE_CATCH
}

#define AFARRAY_IMPL_ASSIGN(F, Op)\
NAN_METHOD(ArrayWrapper::F)\
{\
    \
    \
    try\
    {\
        auto pArray = GetArray(info.This());\
        auto& array = *pArray;\
        bool isDouble = NeedsDouble(array);\
        ARGS_LEN(1)\
        if (info.Length() == 1)\
        {\
            auto value = info[0];\
            auto pOtherArray = TryGetArray(value);\
            Guard guard;\
            if (pOtherArray)\
            {\
                auto& otherArray = *pOtherArray;\
                array Op otherArray;\
            }\
            else if (value->IsNumber())\
            {\
                double v = value->NumberValue();\
                if (floor(v) == v)\
                {\
                    array Op value->Int32Value();\
                }\
                else if (isDouble)\
                {\
                    array Op v;\
                }\
                else\
                {\
                    array Op (float)v;\
                }\
            }\
            else if (value->IsObject())\
            {\
                if (isDouble)\
                {\
                    auto v = ToDComplex(value);\
                    array Op v;\
                }\
                else\
                {\
                    auto v = ToFComplex(value);\
                    array Op v;\
                }\
            }\
            else if (value->IsString())\
            {\
                String::Utf8Value str(value);\
                long long v = strtoll(*str, nullptr, 10);\
                array Op v;\
            }\
            else\
            {\
                return NAN_THROW_INVALID_ARGS();\
            }\
        }\
        else if (info.Length() == 2)\
        {\
            auto regIdx = ToRegionIndex(info[0]);\
            auto reg = get<0>(regIdx);\
            auto value = info[1];\
            auto pOtherArray = TryGetArray(value);\
            switch(reg)\
            {\
                case Region::None:\
                    {\
                        auto idx0 = ToIndex(info[0]);\
                        Guard guard;\
                        if (pOtherArray)\
                        {\
                            auto& otherArray = *pOtherArray;\
                            array(idx0) Op otherArray;\
                        }\
                        else if (value->IsNumber())\
                        {\
                            double v = value->NumberValue();\
                            if (floor(v) == v)\
                            {\
                                array(idx0) Op value->Int32Value();\
                            }\
                            else if (isDouble)\
                            {\
                                array(idx0) Op v;\
                            }\
                            else\
                            {\
                                array(idx0) Op (float)v;\
                            }\
                        }\
                        else if (value->IsObject())\
                        {\
                            if (isDouble)\
                            {\
                                auto v = ToDComplex(value);\
                                array(idx0) Op v;\
                            }\
                            else\
                            {\
                                auto v = ToFComplex(value);\
                                array(idx0) Op v;\
                            }\
                        }\
                        else if (value->IsString())\
                        {\
                            String::Utf8Value str(value);\
                            long long v = strtoll(*str, nullptr, 10);\
                            array(idx0) Op v;\
                        }\
                        else\
                        {\
                            return NAN_THROW_INVALID_ARGS();\
                        }\
                    }\
                    break;\
                case Region::Row:\
                    {\
                        Guard guard;\
                        if (pOtherArray)\
                        {\
                            auto& otherArray = *pOtherArray;\
                            array.row(get<1>(regIdx)) Op otherArray;\
                        }\
                        else if (value->IsNumber())\
                        {\
                            double v = value->NumberValue();\
                            if (floor(v) == v)\
                            {\
                                array.row(get<1>(regIdx)) Op value->Int32Value();\
                            }\
                            else if (isDouble)\
                            {\
                                array.row(get<1>(regIdx)) Op v;\
                            }\
                            else\
                            {\
                                array.row(get<1>(regIdx)) Op (float)v;\
                            }\
                        }\
                        else if (value->IsObject())\
                        {\
                            if (isDouble)\
                            {\
                                auto v = ToDComplex(value);\
                                array.row(get<1>(regIdx)) Op v;\
                            }\
                            else\
                            {\
                                auto v = ToFComplex(value);\
                                array.row(get<1>(regIdx)) Op v;\
                            }\
                        }\
                        else if (value->IsString())\
                        {\
                            String::Utf8Value str(value);\
                            long long v = strtoll(*str, nullptr, 10);\
                            array.row(get<1>(regIdx)) Op v;\
                        }\
                        else\
                        {\
                            return NAN_THROW_INVALID_ARGS();\
                        }\
                    }\
                    break;\
                case Region::Rows:\
                    {\
                        Guard guard;\
                        if (pOtherArray)\
                        {\
                            auto& otherArray = *pOtherArray;\
                            array.rows(get<1>(regIdx), get<2>(regIdx)) Op otherArray;\
                        }\
                        else if (value->IsNumber())\
                        {\
                            double v = value->NumberValue();\
                            if (floor(v) == v)\
                            {\
                                array.rows(get<1>(regIdx), get<2>(regIdx)) Op value->Int32Value();\
                            }\
                            else if (isDouble)\
                            {\
                                array.rows(get<1>(regIdx), get<2>(regIdx)) Op v;\
                            }\
                            else\
                            {\
                                array.rows(get<1>(regIdx), get<2>(regIdx)) Op (float)v;\
                            }\
                        }\
                        else if (value->IsObject())\
                        {\
                            if (isDouble)\
                            {\
                                auto v = ToDComplex(value);\
                                array.rows(get<1>(regIdx), get<2>(regIdx)) Op v;\
                            }\
                            else\
                            {\
                                auto v = ToFComplex(value);\
                                array.rows(get<1>(regIdx), get<2>(regIdx)) Op v;\
                            }\
                        }\
                        else if (value->IsString())\
                        {\
                            String::Utf8Value str(value);\
                            long long v = strtoll(*str, nullptr, 10);\
                            array.rows(get<1>(regIdx), get<2>(regIdx)) Op v;\
                        }\
                        else\
                        {\
                            return NAN_THROW_INVALID_ARGS();\
                        }\
                    }\
                    break;\
                case Region::Col:\
                    {\
                        Guard guard;\
                        if (pOtherArray)\
                        {\
                            auto& otherArray = *pOtherArray;\
                            array.col(get<1>(regIdx)) Op otherArray;\
                        }\
                        else if (value->IsNumber())\
                        {\
                            double v = value->NumberValue();\
                            if (floor(v) == v)\
                            {\
                                array.col(get<1>(regIdx)) Op value->Int32Value();\
                            }\
                            else if (isDouble)\
                            {\
                                array.col(get<1>(regIdx)) Op v;\
                            }\
                            else\
                            {\
                                array.col(get<1>(regIdx)) Op (float)v;\
                            }\
                        }\
                        else if (value->IsObject())\
                        {\
                            if (isDouble)\
                            {\
                                auto v = ToDComplex(value);\
                                array.col(get<1>(regIdx)) Op v;\
                            }\
                            else\
                            {\
                                auto v = ToFComplex(value);\
                                array.col(get<1>(regIdx)) Op v;\
                            }\
                        }\
                        else if (value->IsString())\
                        {\
                            String::Utf8Value str(value);\
                            long long v = strtoll(*str, nullptr, 10);\
                            array.col(get<1>(regIdx)) Op v;\
                        }\
                        else\
                        {\
                            return NAN_THROW_INVALID_ARGS();\
                        }\
                    }\
                    break;\
                case Region::Cols:\
                    {\
                        Guard guard;\
                        if (pOtherArray)\
                        {\
                            auto& otherArray = *pOtherArray;\
                            array.cols(get<1>(regIdx), get<2>(regIdx)) Op otherArray;\
                        }\
                        else if (value->IsNumber())\
                        {\
                            double v = value->NumberValue();\
                            if (floor(v) == v)\
                            {\
                                array.cols(get<1>(regIdx), get<2>(regIdx)) Op value->Int32Value();\
                            }\
                            else if (isDouble)\
                            {\
                                array.cols(get<1>(regIdx), get<2>(regIdx)) Op v;\
                            }\
                            else\
                            {\
                                array.cols(get<1>(regIdx), get<2>(regIdx)) Op (float)v;\
                            }\
                        }\
                        else if (value->IsObject())\
                        {\
                            if (isDouble)\
                            {\
                                auto v = ToDComplex(value);\
                                array.cols(get<1>(regIdx), get<2>(regIdx)) Op v;\
                            }\
                            else\
                            {\
                                auto v = ToFComplex(value);\
                                array.cols(get<1>(regIdx), get<2>(regIdx)) Op v;\
                            }\
                        }\
                        else if (value->IsString())\
                        {\
                            String::Utf8Value str(value);\
                            long long v = strtoll(*str, nullptr, 10);\
                            array.cols(get<1>(regIdx), get<2>(regIdx)) Op v;\
                        }\
                        else\
                        {\
                            return NAN_THROW_INVALID_ARGS();\
                        }\
                    }\
                    break;\
                case Region::Slice:\
                    {\
                        Guard guard;\
                        if (pOtherArray)\
                        {\
                            auto& otherArray = *pOtherArray;\
                            array.slice(get<1>(regIdx)) Op otherArray;\
                        }\
                        else if (value->IsNumber())\
                        {\
                            double v = value->NumberValue();\
                            if (floor(v) == v)\
                            {\
                                array.slice(get<1>(regIdx)) Op value->Int32Value();\
                            }\
                            else if (isDouble)\
                            {\
                                array.slice(get<1>(regIdx)) Op v;\
                            }\
                            else\
                            {\
                                array.slice(get<1>(regIdx)) Op (float)v;\
                            }\
                        }\
                        else if (value->IsObject())\
                        {\
                            if (isDouble)\
                            {\
                                auto v = ToDComplex(value);\
                                array.slice(get<1>(regIdx)) Op v;\
                            }\
                            else\
                            {\
                                auto v = ToFComplex(value);\
                                array.slice(get<1>(regIdx)) Op v;\
                            }\
                        }\
                        else if (value->IsString())\
                        {\
                            String::Utf8Value str(value);\
                            long long v = strtoll(*str, nullptr, 10);\
                            array.slice(get<1>(regIdx)) Op v;\
                        }\
                        else\
                        {\
                            return NAN_THROW_INVALID_ARGS();\
                        }\
                    }\
                    break;\
                case Region::Slices:\
                    {\
                        Guard guard;\
                        if (pOtherArray)\
                        {\
                            auto& otherArray = *pOtherArray;\
                            array.slices(get<1>(regIdx), get<2>(regIdx)) Op otherArray;\
                        }\
                        else if (value->IsNumber())\
                        {\
                            double v = value->NumberValue();\
                            if (floor(v) == v)\
                            {\
                                array.slices(get<1>(regIdx), get<2>(regIdx)) Op value->Int32Value();\
                            }\
                            else if (isDouble)\
                            {\
                                array.slices(get<1>(regIdx), get<2>(regIdx)) Op v;\
                            }\
                            else\
                            {\
                                array.slices(get<1>(regIdx), get<2>(regIdx)) Op (float)v;\
                            }\
                        }\
                        else if (value->IsObject())\
                        {\
                            if (isDouble)\
                            {\
                                auto v = ToDComplex(value);\
                                array.slices(get<1>(regIdx), get<2>(regIdx)) Op v;\
                            }\
                            else\
                            {\
                                auto v = ToFComplex(value);\
                                array.slices(get<1>(regIdx), get<2>(regIdx)) Op v;\
                            }\
                        }\
                        else if (value->IsString())\
                        {\
                            String::Utf8Value str(value);\
                            long long v = strtoll(*str, nullptr, 10);\
                            array.slices(get<1>(regIdx), get<2>(regIdx)) Op v;\
                        }\
                        else\
                        {\
                            return NAN_THROW_INVALID_ARGS();\
                        }\
                    }\
                    break;\
            }\
        }\
        else if (info.Length() == 3)\
        {\
            auto idx0 = ToIndex(info[0]);\
            auto idx1 = ToIndex(info[1]);\
            auto value = info[2];\
            auto pOtherArray = TryGetArray(value);\
            Guard guard;\
            if (pOtherArray)\
            {\
                auto& otherArray = *pOtherArray;\
                array(idx0, idx1) Op otherArray;\
            }\
            else if (value->IsNumber())\
            {\
                double v = value->NumberValue();\
                if (floor(v) == v)\
                {\
                    array(idx0, idx1) Op value->Int32Value();\
                }\
                else if (isDouble)\
                {\
                    array(idx0, idx1) Op v;\
                }\
                else\
                {\
                    array(idx0, idx1) Op (float)v;\
                }\
            }\
            else if (value->IsObject())\
            {\
                if (isDouble)\
                {\
                    auto v = ToDComplex(value);\
                    array(idx0, idx1) Op v;\
                }\
                else\
                {\
                    auto v = ToFComplex(value);\
                    array(idx0, idx1) Op v;\
                }\
            }\
            else if (value->IsString())\
            {\
                String::Utf8Value str(value);\
                long long v = strtoll(*str, nullptr, 10);\
                array(idx0, idx1) Op v;\
            }\
            else\
            {\
                return NAN_THROW_INVALID_ARGS();\
            }\
        }\
        else if (info.Length() == 4)\
        {\
            auto idx0 = ToIndex(info[0]);\
            auto idx1 = ToIndex(info[1]);\
            auto idx2 = ToIndex(info[2]);\
            auto value = info[3];\
            auto pOtherArray = TryGetArray(value);\
            Guard guard;\
            if (pOtherArray)\
            {\
                auto& otherArray = *pOtherArray;\
                array(idx0, idx1, idx2) Op otherArray;\
            }\
            else if (value->IsNumber())\
            {\
                double v = value->NumberValue();\
                if (floor(v) == v)\
                {\
                    array(idx0, idx1, idx2) Op value->Int32Value();\
                }\
                else if (isDouble)\
                {\
                    array(idx0, idx1, idx2) Op v;\
                }\
                else\
                {\
                    array(idx0, idx1, idx2) Op (float)v;\
                }\
            }\
            else if (value->IsObject())\
            {\
                if (isDouble)\
                {\
                    auto v = ToDComplex(value);\
                    array(idx0, idx1, idx2) Op v;\
                }\
                else\
                {\
                    auto v = ToFComplex(value);\
                    array(idx0, idx1, idx2) Op v;\
                }\
            }\
            else if (value->IsString())\
            {\
                String::Utf8Value str(value);\
                long long v = strtoll(*str, nullptr, 10);\
                array(idx0, idx1, idx2) Op v;\
            }\
            else\
            {\
                return NAN_THROW_INVALID_ARGS();\
            }\
        }\
        else\
        {\
            auto idx0 = ToIndex(info[0]);\
            auto idx1 = ToIndex(info[1]);\
            auto idx2 = ToIndex(info[2]);\
            auto idx3 = ToIndex(info[3]);\
            auto value = info[4];\
            auto pOtherArray = TryGetArray(value);\
            Guard guard;\
            if (pOtherArray)\
            {\
                auto& otherArray = *pOtherArray;\
                array(idx0, idx1, idx2, idx3) Op otherArray;\
            }\
            else if (value->IsNumber())\
            {\
                double v = value->NumberValue();\
                if (floor(v) == v)\
                {\
                    array(idx0, idx1, idx2, idx3) Op value->Int32Value();\
                }\
                else if (isDouble)\
                {\
                    array(idx0, idx1, idx2, idx3) Op v;\
                }\
                else\
                {\
                    array(idx0, idx1, idx2, idx3) Op (float)v;\
                }\
            }\
            else if (value->IsObject())\
            {\
                if (isDouble)\
                {\
                    auto v = ToDComplex(value);\
                    array(idx0, idx1, idx2, idx3) Op v;\
                }\
                else\
                {\
                    auto v = ToFComplex(value);\
                    array(idx0, idx1, idx2, idx3) Op v;\
                }\
            }\
            else if (value->IsString())\
            {\
                String::Utf8Value str(value);\
                long long v = strtoll(*str, nullptr, 10);\
                array(idx0, idx1, idx2, idx3) Op v;\
            }\
            else\
            {\
                return NAN_THROW_INVALID_ARGS();\
            }\
        }\
        \
        info.GetReturnValue().Set(info.This());\
    }\
    ARRAYFIRE_CATCH\
}

AFARRAY_IMPL_ASSIGN(Assign, =)
AFARRAY_IMPL_ASSIGN(AddAssign, +=)
AFARRAY_IMPL_ASSIGN(SubAssign, -=)
AFARRAY_IMPL_ASSIGN(MulAssign, *=)
AFARRAY_IMPL_ASSIGN(DivAssign, /=)
#undef AFARRAY_IMPL_ASSIGN

#define AFARRAY_IMPL_BINOP(F, Op)\
NAN_METHOD(ArrayWrapper::F)\
{\
    \
    \
    try\
    {\
        auto& array = *GetArray(info.This());\
        bool isDouble = NeedsDouble(array);\
        ARGS_LEN(1)\
        auto value = info[0];\
        auto pOtherArray = TryGetArray(value);\
        af::array* result = nullptr;\
        Guard guard;\
        if (pOtherArray)\
        {\
            auto& otherArray = *pOtherArray;\
            result = new af::array(array Op otherArray);\
        }\
        else if (value->IsNumber())\
        {\
            double v = value->NumberValue();\
            if (floor(v) == v)\
            {\
                result = new af::array(array Op value->Int32Value());\
            }\
            else if (isDouble)\
            {\
                result = new af::array(array Op v);\
            }\
            else\
            {\
                result = new af::array(array Op (float)v);\
            }\
        }\
        else if (value->IsObject())\
        {\
            if (isDouble)\
            {\
                auto v = ToDComplex(value);\
                result = new af::array(array Op v);\
            }\
            else\
            {\
                auto v = ToFComplex(value);\
                result = new af::array(array Op v);\
            }\
        }\
        else if (value->IsString())\
        {\
            String::Utf8Value str(value);\
            intl v = strtoll(*str, nullptr, 10);\
            result = new af::array(array Op v);\
        }\
        else\
        {\
            return NAN_THROW_INVALID_ARGS();\
        }\
        \
        info.GetReturnValue().Set(New(result));\
    }\
    ARRAYFIRE_CATCH\
}

AFARRAY_IMPL_BINOP(Add, +)
AFARRAY_IMPL_BINOP(Sub, -)
AFARRAY_IMPL_BINOP(Mul, *)
AFARRAY_IMPL_BINOP(Div, /)
AFARRAY_IMPL_BINOP(BitShiftL, <<)
AFARRAY_IMPL_BINOP(BitShiftR, >>)

AFARRAY_IMPL_BINOP(Lt, <)
AFARRAY_IMPL_BINOP(Gt, >)
AFARRAY_IMPL_BINOP(Le, <=)
AFARRAY_IMPL_BINOP(Ge, >=)
AFARRAY_IMPL_BINOP(Eq, ==)
AFARRAY_IMPL_BINOP(Neq, !=)
AFARRAY_IMPL_BINOP(And, &&)
AFARRAY_IMPL_BINOP(Or, ||)
AFARRAY_IMPL_BINOP(BitAnd, &)
AFARRAY_IMPL_BINOP(BitOr, |)
AFARRAY_IMPL_BINOP(BitXor, ^)
#undef AFARRAY_IMPL_BINOP

#define AFARRAY_IMPL_BINOP(F, Op)\
NAN_METHOD(ArrayWrapper::F)\
{\
    \
    \
    try\
    {\
        auto& array = *GetArray(info.This());\
        bool isDouble = NeedsDouble(array);\
        ARGS_LEN(1)\
        auto value = info[0];\
        auto pOtherArray = TryGetArray(value);\
        af::array* result = nullptr;\
        Guard guard;\
        if (pOtherArray)\
        {\
            auto& otherArray = *pOtherArray;\
            result = new af::array(otherArray Op array);\
        }\
        else if (value->IsNumber())\
        {\
            double v = value->NumberValue();\
            if (floor(v) == v)\
            {\
                result = new af::array(value->Int32Value() Op array);\
            }\
            else if (isDouble)\
            {\
                result = new af::array(v Op array);\
            }\
            else\
            {\
                result = new af::array((float)v Op array);\
            }\
        }\
        else if (value->IsObject())\
        {\
            if (isDouble)\
            {\
                auto v = ToDComplex(value);\
                result = new af::array(v Op array);\
            }\
            else\
            {\
                auto v = ToFComplex(value);\
                result = new af::array(v Op array);\
            }\
        }\
        else if (value->IsString())\
        {\
            String::Utf8Value str(value);\
            intl v = strtoll(*str, nullptr, 10);\
            result = new af::array(v Op array);\
        }\
        else\
        {\
            return NAN_THROW_INVALID_ARGS();\
        }\
        \
        info.GetReturnValue().Set(New(result));\
    }\
    ARRAYFIRE_CATCH\
}

AFARRAY_IMPL_BINOP(RhsAdd, +)
AFARRAY_IMPL_BINOP(RhsSub, -)
AFARRAY_IMPL_BINOP(RhsMul, *)
AFARRAY_IMPL_BINOP(RhsDiv, /)
AFARRAY_IMPL_BINOP(RhsBitShiftL, <<)
AFARRAY_IMPL_BINOP(RhsBitShiftR, >>)

AFARRAY_IMPL_BINOP(RhsLt, <)
AFARRAY_IMPL_BINOP(RhsGt, >)
AFARRAY_IMPL_BINOP(RhsLe, <=)
AFARRAY_IMPL_BINOP(RhsGe, >=)
AFARRAY_IMPL_BINOP(RhsEq, ==)
AFARRAY_IMPL_BINOP(RhsNeq, !=)
AFARRAY_IMPL_BINOP(RhsAnd, &&)
AFARRAY_IMPL_BINOP(RhsOr, ||)
AFARRAY_IMPL_BINOP(RhsBitAnd, &)
AFARRAY_IMPL_BINOP(RhsBitOr, |)
AFARRAY_IMPL_BINOP(RhsBitXor, ^)
#undef AFARRAY_IMPL_BINOP

#define AFARRAY_IMPL_UNOP(F, Op)\
NAN_METHOD(ArrayWrapper::F)\
{\
    \
    \
    try\
    {\
        auto& array = *GetArray(info.This());\
        Guard guard;\
        info.GetReturnValue().Set(New(array.operator Op()));\
    }\
    ARRAYFIRE_CATCH\
}

AFARRAY_IMPL_UNOP(Neg, -)
AFARRAY_IMPL_UNOP(Not, !)
#undef AFARRAY_IMPL_UNOP
