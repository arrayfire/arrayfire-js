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

Persistent<Function> ArrayWrapper::constructor;

ArrayWrapper::ArrayWrapper(af::array* array) :
    _array(array)
{
    assert(array);
}

ArrayWrapper::~ArrayWrapper()
{
    delete _array;
}

void ArrayWrapper::Init(v8::Local<v8::Object> exports)
{
    auto tmpl = NanNew<FunctionTemplate>(New);
    tmpl->SetClassName(NanNew("AFArray"));

    int noOfMethods = 21;
    tmpl->InstanceTemplate()->SetInternalFieldCount(noOfMethods);
    NanSetPrototypeTemplate(tmpl, NanNew("elements"), NanNew<FunctionTemplate>(Elements), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("host"), NanNew<FunctionTemplate>(Host), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("copyToHost"), NanNew<FunctionTemplate>(Host), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("scalar"), NanNew<FunctionTemplate>(Scalar), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("value"), NanNew<FunctionTemplate>(Scalar), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("write"), NanNew<FunctionTemplate>(Write), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("type"), NanNew<FunctionTemplate>(Type), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("dims"), NanNew<FunctionTemplate>(Dims), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("numdims"), NanNew<FunctionTemplate>(NumDims), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("numDims"), NanNew<FunctionTemplate>(NumDims), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("bytes"), NanNew<FunctionTemplate>(Bytes), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("copy"), NanNew<FunctionTemplate>(Copy), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isempty"), NanNew<FunctionTemplate>(IsEmpty), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isEmpty"), NanNew<FunctionTemplate>(IsEmpty), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isscalar"), NanNew<FunctionTemplate>(IsScalar), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isScalar"), NanNew<FunctionTemplate>(IsScalar), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isvector"), NanNew<FunctionTemplate>(IsVector), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isVector"), NanNew<FunctionTemplate>(IsVector), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isrow"), NanNew<FunctionTemplate>(IsRow), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isRow"), NanNew<FunctionTemplate>(IsRow), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("iscolumn"), NanNew<FunctionTemplate>(IsColumn), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isColumn"), NanNew<FunctionTemplate>(IsColumn), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("iscomplex"), NanNew<FunctionTemplate>(IsComplex), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isComplex"), NanNew<FunctionTemplate>(IsComplex), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isreal"), NanNew<FunctionTemplate>(IsReal), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isReal"), NanNew<FunctionTemplate>(IsReal), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isdouble"), NanNew<FunctionTemplate>(IsDouble), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isDouble"), NanNew<FunctionTemplate>(IsDouble), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("issingle"), NanNew<FunctionTemplate>(IsSingle), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isSingle"), NanNew<FunctionTemplate>(IsSingle), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isrealfloating"), NanNew<FunctionTemplate>(IsRealFloating), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isRealFloating"), NanNew<FunctionTemplate>(IsRealFloating), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isfloating"), NanNew<FunctionTemplate>(IsFloating), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isFloating"), NanNew<FunctionTemplate>(IsFloating), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isinteger"), NanNew<FunctionTemplate>(IsInteger), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isInteger"), NanNew<FunctionTemplate>(IsInteger), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isbool"), NanNew<FunctionTemplate>(IsBool), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isBool"), NanNew<FunctionTemplate>(IsBool), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("eval"), NanNew<FunctionTemplate>(Eval), v8::ReadOnly);

    NanSetPrototypeTemplate(tmpl, NanNew("at"), NanNew<FunctionTemplate>(At), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("row"), NanNew<FunctionTemplate>(Row), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("col"), NanNew<FunctionTemplate>(Col), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("slice"), NanNew<FunctionTemplate>(Slice), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("rows"), NanNew<FunctionTemplate>(Rows), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("cols"), NanNew<FunctionTemplate>(Cols), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("slices"), NanNew<FunctionTemplate>(Slices), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("as"), NanNew<FunctionTemplate>(As), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("assign"), NanNew<FunctionTemplate>(Assign), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("set"), NanNew<FunctionTemplate>(Assign), v8::ReadOnly);

    NanSetPrototypeTemplate(tmpl, NanNew("add"), NanNew<FunctionTemplate>(Add), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("addAssign"), NanNew<FunctionTemplate>(AddAssign), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("sub"), NanNew<FunctionTemplate>(Sub), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("subAssign"), NanNew<FunctionTemplate>(SubAssign), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("mul"), NanNew<FunctionTemplate>(Mul), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("mulAssign"), NanNew<FunctionTemplate>(MulAssign), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("div"), NanNew<FunctionTemplate>(Div), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("divAssign"), NanNew<FunctionTemplate>(DivAssign), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("bitshiftl"), NanNew<FunctionTemplate>(BitShiftL), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("bitShiftL"), NanNew<FunctionTemplate>(BitShiftL), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("bitshiftr"), NanNew<FunctionTemplate>(BitShiftR), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("bitShiftR"), NanNew<FunctionTemplate>(BitShiftR), v8::ReadOnly);

    NanSetPrototypeTemplate(tmpl, NanNew("lt"), NanNew<FunctionTemplate>(Lt), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("gt"), NanNew<FunctionTemplate>(Gt), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("le"), NanNew<FunctionTemplate>(Le), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("ge"), NanNew<FunctionTemplate>(Ge), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("eq"), NanNew<FunctionTemplate>(Eq), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("neq"), NanNew<FunctionTemplate>(Neq), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("and"), NanNew<FunctionTemplate>(And), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("or"), NanNew<FunctionTemplate>(Or), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("neg"), NanNew<FunctionTemplate>(Neg), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("not"), NanNew<FunctionTemplate>(Not), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("bitAnd"), NanNew<FunctionTemplate>(BitAnd), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("bitOr"), NanNew<FunctionTemplate>(BitOr), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("bitXor"), NanNew<FunctionTemplate>(BitXor), v8::ReadOnly);

    auto f = tmpl->GetFunction();
    f->Set(NanNew("create"), NanNew<FunctionTemplate>(Create)->GetFunction());
    NanAssignPersistent<Function>(constructor, f);
    exports->Set(NanNew("AFArray"), f);
}

v8::Local<Object> ArrayWrapper::New(const af::array& array)
{
    return New(new af::array(array));
}

v8::Local<v8::Object> ArrayWrapper::New(af::array* array)
{
    assert(array);
    Local<Value> args[] = { WrapPointer(array) };
    auto c = NanNew(constructor);
    auto inst = c->NewInstance(1, args);
    assert(ObjectWrap::Unwrap<ArrayWrapper>(inst)->_array == array);
    return inst;
}

void ArrayWrapper::NewAsync(const v8::FunctionCallbackInfo<v8::Value>& args, const std::function<af::array*()>& arrayFactory)
{
    if (args.Length() >= 1 && args[args.Length() - 1]->IsFunction())
    {
        auto callback = new NanCallback(args[args.Length() - 1].As<Function>());
        auto worker = new Worker<af::array*>(callback, arrayFactory, [](Worker<af::array*>* w, af::array* a){ return ArrayWrapper::New(a); });
        NanAsyncQueueWorker(worker);
        NanReturnUndefined();
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
    FIRE_THROW("Argument is not an AFArray instance.");
}

af::array* ArrayWrapper::TryGetArray(v8::Local<v8::Value> value)
{
    try
    {
        if (value->IsObject())
        {
            auto wrapper = ObjectWrap::Unwrap<ArrayWrapper>(value.As<Object>());
            if (wrapper) return wrapper->_array;
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
    FIRE_THROW("Argument is not an AFArray instance.");
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

af::array* ArrayWrapper::GetArrayAt(const v8::FunctionCallbackInfo<v8::Value>& args, int index)
{
    auto array = TryGetArrayAt(args, index);
    if (array) return array;
    stringstream ss;
    ss << "Argument at position " << to_string(index) << ". is not an AFArray instance.";
    FIRE_THROW(ss.str().c_str());
}

af::array* ArrayWrapper::TryGetArrayAt(const v8::FunctionCallbackInfo<v8::Value>& args, int index)
{
    if (index < args.Length())
    {
        return GetArray(args[index]);
    }
    return nullptr;
}

void ArrayWrapper::New(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    NanScope();

    try
    {
        ArrayWrapper* instance = nullptr;
        int buffIdx = -1;
        try
        {
            if (args.Length() == 0)
            {
                Guard();
                instance = new ArrayWrapper(new af::array());
            }
            else if (args.Length() == 1)
            {
                if (Buffer::HasInstance(args[0]))
                {
                    instance = new ArrayWrapper(reinterpret_cast<af::array*>(Buffer::Data(args[0])));
                }
            }
            else
            {
                Guard();
                for (int i = 0; i < args.Length(); i++)
                {
                    if (Buffer::HasInstance(args[i]))
                    {
                        buffIdx = i;
                        break;
                    }
                }

                if (buffIdx == -1)
                {
                    // Creating new
                    auto dimAndType = ParseDimAndTypeArgs(args);
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

        instance->Wrap(args.Holder());

        //Set instance props: NanObjectWrapHandle(obj)->Set(NanNew(symbol), value);

        NanReturnValue(args.Holder());
    }
    FIRE_CATCH
}

template<typename T>
af::array* ArrayWrapper::CreateArray(void* ptr, af_source src, const af::dim4& dim4)
{
    Guard();
    return new af::array(dim4, (T*)ptr, src);
}

NAN_METHOD(ArrayWrapper::Create)
{
    NanScope();

    try
    {
        int buffIdx = -1;
        function<af::array*()> factory;

        for (int i = 0; i < args.Length(); i++)
        {
            if (Buffer::HasInstance(args[i]))
            {
                buffIdx = i;
                break;
            }
        }

        if (buffIdx == -1)
        {
            return NAN_THROW("Buffer argument expected.");
        }
        else if (buffIdx + 1 < args.Length())
        {
            // Copy / wrap ptr
            // args: dim0..dimn, dtype, ptr[, source]
            af_source src = afHost;
            if (buffIdx + 1 < args.Length() && args[buffIdx + 1]->IsNumber())
            {
                src = (af_source)(args[buffIdx + 2]->Int32Value());
            }
            auto buffObj = args[buffIdx]->ToObject();
            char* ptr = Buffer::Data(buffObj);
            auto dimAndType = ParseDimAndTypeArgs(args, buffIdx);
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

        NanCallback *callback = nullptr;
        if (args[args.Length() - 1]->IsFunction())
        {
            callback = new NanCallback(args[args.Length() - 1].As<Function>());
        }

        if (!callback)
        {
            return NAN_THROW_CB_EXPECTED();
        }

        auto conv = [](Worker<af::array*>* w, af::array* a)
        {
            return New(a);
        };
        auto worker = new Worker<af::array*>(callback, move(factory), move(conv));
        worker->SaveToPersistent("data", args[buffIdx]->ToObject());

        NanAsyncQueueWorker(worker);
        NanReturnUndefined();
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::Elements)
{
    NanScope();

    try
    {
        Guard();
        NanReturnValue(NanNew<Number>(GetArray(args.This())->elements()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::Host)
{
    NanScope();

    try
    {
        ARGS_LEN(1)

        char* buffData;
        auto pArray = GetArray(args.This());

        if (Buffer::HasInstance(args[0]))
        {
            buffData = Buffer::Data(args[0]);

            if (Buffer::Length(args[0]) < pArray->bytes())
            {
                return NAN_THROW("Buffer is too small to hold values.");
            }

            af::array array(*pArray);
            auto exec = [=]()
            {
                Guard();
                array.host(buffData);
            };
            auto worker = new Worker<void>(GetCallback(args), move(exec));
            worker->SaveToPersistent("data", args[0]->ToObject());

            NanAsyncQueueWorker(worker);
            NanReturnUndefined();
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
                    Guard();
                    array.host(buffData);
                    return buffData;
                };
                auto conv = [=](Worker<char*>* w, char* data)
                {
                    return NanNewBufferHandle(data, size, [](char* data, void* hint) { delete[] data; }, nullptr);
                };
                auto worker = new Worker<char*>(GetCallback(args), move(exec), move(conv));
                NanAsyncQueueWorker(worker);
                NanReturnUndefined();
            }
            catch (...)
            {
                delete[] buffData;
                throw;
            }
        }
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::Scalar)
{
    NanScope();

    try
    {
        ARGS_LEN(1)

        auto pArray = GetArray(args.This());
        af::array array(*pArray);
        switch (array.type())
        {
            case f32:
                {
                    auto exec = [=]()
                    {
                        Guard();
                        return array.scalar<float>();
                    };
                    auto worker = new Worker<float>(GetCallback(args), move(exec));
                    NanAsyncQueueWorker(worker);
                }
                break;
            case f64:
                {
                    auto exec = [=]()
                    {
                        Guard();
                        return array.scalar<double>();
                    };
                    auto worker = new Worker<double>(GetCallback(args), move(exec));
                    NanAsyncQueueWorker(worker);
                }
                break;
            case s32:
                {
                    auto exec = [=]()
                    {
                        Guard();
                        return array.scalar<int>();
                    };
                    auto worker = new Worker<int>(GetCallback(args), move(exec));
                    NanAsyncQueueWorker(worker);
                }
                break;
            case u32:
                {
                    auto exec = [=]()
                    {
                        Guard();
                        return array.scalar<unsigned>();
                    };
                    auto worker = new Worker<unsigned>(GetCallback(args), move(exec));
                    NanAsyncQueueWorker(worker);
                }
                break;
            case u8:
                {
                    auto exec = [=]()
                    {
                        Guard();
                        return array.scalar<unsigned char>();
                    };
                    auto worker = new Worker<unsigned char>(GetCallback(args), move(exec));
                    NanAsyncQueueWorker(worker);
                }
                break;
            case b8:
                {
                    auto exec = [=]()
                    {
                        Guard();
                        return array.scalar<char>();
                    };
                    auto worker = new Worker<char>(GetCallback(args), move(exec));
                    NanAsyncQueueWorker(worker);
                }
                break;
            case c32:
                {
                    auto exec = [=]()
                    {
                        Guard();
                        return array.scalar<af::cfloat>();
                    };
                    auto conv = [=](Worker<af::cfloat>* w, af::cfloat data)
                    {
                        return ToV8Complex(data);
                    };
                    auto worker = new Worker<af::cfloat>(GetCallback(args), move(exec), move(conv));
                    NanAsyncQueueWorker(worker);
                }
                break;
            case c64:
                {
                    auto exec = [=]()
                    {
                        Guard();
                        return array.scalar<af::cdouble>();
                    };
                    auto conv = [=](Worker<af::cdouble>* w, af::cdouble data)
                    {
                        return ToV8Complex(data);
                    };
                    auto worker = new Worker<af::cdouble>(GetCallback(args), move(exec), move(conv));
                    NanAsyncQueueWorker(worker);
                }
                break;
            case s64:
                {
                    auto exec = [=]()
                    {
                        Guard();
                        return array.scalar<long long>();
                    };
                    auto conv = [=](Worker<long long>* w, long long data)
                    {
                        return NanNew(to_string(data).c_str());
                    };
                    auto worker = new Worker<long long>(GetCallback(args), move(exec), move(conv));
                    NanAsyncQueueWorker(worker);
                }
                break;
            case u64:
                {
                    auto exec = [=]()
                    {
                        Guard();
                        return array.scalar<unsigned long long>();
                    };
                    auto conv = [=](Worker<unsigned long long>* w, unsigned long long data)
                    {
                        return NanNew(to_string(data).c_str());
                    };
                    auto worker = new Worker<unsigned long long>(GetCallback(args), move(exec), move(conv));
                    NanAsyncQueueWorker(worker);
                }
                break;
            default:
                assert(false);
        }
        NanReturnUndefined();
    }
    FIRE_CATCH
}


NAN_METHOD(ArrayWrapper::Write)
{
    NanScope();

    try
    {
        ARGS_LEN(3)

        char* buffData;
        auto pArray = GetArray(args.This());

        if (Buffer::HasInstance(args[0]))
        {
            buffData = Buffer::Data(args[0]);
        }
        else
        {
            return NAN_THROW("First argument is no a Buffer.");
        }

        unsigned bytes = args[1]->Uint32Value();
        af_source src = afHost;
        if (args.Length() > 3)
        {
            src = (af_source)(args[2]->Int32Value());
        }

        af::array array(*pArray);
        auto exec = [=]()
        {
            Guard();
            af_write_array(array.get(), buffData, bytes, src);
        };
        auto worker = new Worker<void>(GetCallback(args), move(exec));
        worker->SaveToPersistent("data", args[0]->ToObject());

        NanAsyncQueueWorker(worker);
        NanReturnUndefined();
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::Type)
{
    NanScope();

    try
    {
        NanReturnValue(GetArray(args.This())->type());
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::Dims)
{
    NanScope();

    try
    {
        auto pArray = GetArray(args.This());
        if (!args.Length())
        {
            auto dims = pArray->dims();
            auto jsDims = NanNew<Object>();
            jsDims->Set(NanNew(Symbols::Elements), NanNew<Number>(dims.elements()));
            jsDims->Set(NanNew(Symbols::Ndims), NanNew<Number>(dims.ndims()));
            jsDims->Set(NanNew(Symbols::NDims), NanNew<Number>(dims.ndims()));
            auto pDims = NanNew<Array>(4);
            pDims->Set(0, NanNew<Number>(dims[0]));
            pDims->Set(1, NanNew<Number>(dims[1]));
            pDims->Set(2, NanNew<Number>(dims[2]));
            pDims->Set(3, NanNew<Number>(dims[3]));
            jsDims->Set(NanNew(Symbols::Dims), pDims);

            NanReturnValue(jsDims);
        }
        else
        {
            NanReturnValue(NanNew<Number>(pArray->dims(args[0]->Uint32Value())));
        }
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::NumDims)
{
    NanScope();

    try
    {
        NanReturnValue(NanNew<Number>(GetArray(args.This())->numdims()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::Bytes)
{
    NanScope();

    try
    {
        NanReturnValue(NanNew<Number>((unsigned)GetArray(args.This())->bytes()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::Copy)
{
    NanScope();

    try
    {
        Guard();
        NanReturnValue(New(GetArray(args.This())->copy()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsEmpty)
{
    NanScope();

    try
    {
        NanReturnValue(NanNew(GetArray(args.This())->isempty()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsScalar)
{
    NanScope();

    try
    {
        NanReturnValue(NanNew(GetArray(args.This())->isscalar()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsVector)
{
    NanScope();

    try
    {
        NanReturnValue(NanNew(GetArray(args.This())->isvector()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsRow)
{
    NanScope();

    try
    {
        NanReturnValue(NanNew(GetArray(args.This())->isrow()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsColumn)
{
    NanScope();

    try
    {
        NanReturnValue(NanNew(GetArray(args.This())->iscolumn()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsComplex)
{
    NanScope();

    try
    {
        NanReturnValue(NanNew(GetArray(args.This())->iscomplex()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsReal)
{
    NanScope();

    try
    {
        NanReturnValue(NanNew(GetArray(args.This())->isreal()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsDouble)
{
    NanScope();

    try
    {
        NanReturnValue(NanNew(GetArray(args.This())->isdouble()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsSingle)
{
    NanScope();

    try
    {
        NanReturnValue(NanNew(GetArray(args.This())->issingle()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsRealFloating)
{
    NanScope();

    try
    {
        NanReturnValue(NanNew(GetArray(args.This())->isrealfloating()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsFloating)
{
    NanScope();

    try
    {
        NanReturnValue(NanNew(GetArray(args.This())->isfloating()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsInteger)
{
    NanScope();

    try
    {
        NanReturnValue(NanNew(GetArray(args.This())->isinteger()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsBool)
{
    NanScope();

    try
    {
        NanReturnValue(NanNew(GetArray(args.This())->type() == b8));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::Eval)
{
    NanScope();

    try
    {
        Guard();
        GetArray(args.This())->eval();
        NanReturnUndefined();
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::At)
{
    // Aka "indexing"
    NanScope();

    try
    {
        ARGS_LEN(1)

        Guard();

        if (args.Length() < 2)
        {
            NanReturnValue(New(GetArray(args.This())->operator()(ToIndex(args[0]))));
        }
        else if (args.Length() < 3)
        {
            NanReturnValue(New(GetArray(args.This())->operator()(ToIndex(args[0]), ToIndex(args[1]))));
        }
        else if (args.Length() < 4)
        {
            NanReturnValue(New(GetArray(args.This())->operator()(ToIndex(args[0]), ToIndex(args[1]), ToIndex(args[2]))));
        }
        else
        {
            NanReturnValue(New(GetArray(args.This())->operator()(ToIndex(args[0]), ToIndex(args[1]), ToIndex(args[2]), ToIndex(args[3]))));
        }
    }
    FIRE_CATCH
}

#define AFARRAY_IMPL_IDX1(F, f)\
NAN_METHOD(ArrayWrapper::F)\
{\
    NanScope();\
    try\
    {\
        ARGS_LEN(1)\
        Guard();\
        auto pArray = GetArray(args.This());\
        NanReturnValue(New(pArray->f(args[0]->Int32Value())));\
    }\
    FIRE_CATCH\
}

AFARRAY_IMPL_IDX1(Row, row)
AFARRAY_IMPL_IDX1(Col, col)
AFARRAY_IMPL_IDX1(Slice, slice)

#define AFARRAY_IMPL_IDX2(F, f)\
NAN_METHOD(ArrayWrapper::F)\
{\
    NanScope();\
    try\
    {\
        ARGS_LEN(2);\
        Guard();\
        auto pArray = GetArray(args.This());\
        NanReturnValue(New(pArray->f(args[0]->Int32Value(), args[1]->Int32Value())));\
    }\
    FIRE_CATCH\
}

AFARRAY_IMPL_IDX2(Rows, rows)
AFARRAY_IMPL_IDX2(Cols, cols)
AFARRAY_IMPL_IDX2(Slices, slices)

NAN_METHOD(ArrayWrapper::As)
{
    NanScope();
    try
    {
        ARGS_LEN(1);
        af::dtype type = GetDTypeInfo(args[0]->Uint32Value()).first;
        Guard();
        NanReturnValue(New(GetArray(args.This())->as(type)));
    }
    FIRE_CATCH
}

#define AFARRAY_IMPL_ASSIGN(F, Op)\
NAN_METHOD(ArrayWrapper::F)\
{\
    NanScope();\
    \
    try\
    {\
        auto pArray = GetArray(args.This());\
        auto& Array = *pArray;\
        bool isDouble = NeedsDouble(Array);\
        ARGS_LEN(1)\
        auto value = args[0];\
        auto pOtherArray = TryGetArray(value);\
        Guard();\
        if (pOtherArray)\
        {\
            auto& otherArray = *pOtherArray;\
            Array Op otherArray;\
        }\
        else if (value->IsNumber())\
        {\
            double v = value->NumberValue();\
            if (floor(v) == v)\
            {\
                Array Op value->Int32Value();\
            }\
            else if (isDouble)\
            {\
                Array Op v;\
            }\
            else\
            {\
                Array Op (float)v;\
            }\
        }\
        else if (value->IsObject())\
        {\
            if (isDouble)\
            {\
                auto v = ToDComplex(value);\
                Array Op v;\
            }\
            else\
            {\
                auto v = ToFComplex(value);\
                Array Op v;\
            }\
        }\
        else if (value->IsString())\
        {\
            String::Utf8Value str(value);\
            long long v = strtoll(*str, nullptr, 10);\
            Array Op v;\
        }\
        else\
        {\
            return NAN_THROW_INVALID_ARGS();\
        }\
        \
        NanReturnValue(args.This());\
    }\
    FIRE_CATCH\
}

AFARRAY_IMPL_ASSIGN(Assign, =)
AFARRAY_IMPL_ASSIGN(AddAssign, +=)
AFARRAY_IMPL_ASSIGN(SubAssign, -=)
AFARRAY_IMPL_ASSIGN(MulAssign, *=)
AFARRAY_IMPL_ASSIGN(DivAssign, /=)

#define AFARRAY_IMPL_BINOP(F, Op)\
NAN_METHOD(ArrayWrapper::F)\
{\
    NanScope();\
    \
    try\
    {\
        auto& array = *GetArray(args.This());\
        bool isDouble = NeedsDouble(array);\
        ARGS_LEN(1)\
        auto value = args[0];\
        auto pOtherArray = TryGetArray(value);\
        af::array* result = nullptr;\
        Guard();\
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
        NanReturnValue(New(result));\
    }\
    FIRE_CATCH\
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

#define AFARRAY_IMPL_UNOP(F, Op)\
NAN_METHOD(ArrayWrapper::F)\
{\
    NanScope();\
    \
    try\
    {\
        auto& array = *GetArray(args.This());\
        Guard();\
        NanReturnValue(New(array.operator Op()));\
    }\
    FIRE_CATCH\
}

AFARRAY_IMPL_UNOP(Neg, -)
AFARRAY_IMPL_UNOP(Not, !)
