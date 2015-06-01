#include "ext.h"
#include "arraywrapper.h"
#include "helpers.h"
#include "guard.h"
#include "worker.h"

using namespace v8;
using namespace std;
using namespace node;

Persistent<Function> ArrayWrapper::constructor;

ArrayWrapper::ArrayWrapper(af::array* array) :
    array(array)
{
    assert(array);
}

ArrayWrapper::~ArrayWrapper()
{
    delete array;
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

    auto f = tmpl->GetFunction();
    f->Set(NanNew("create"), NanNew<FunctionTemplate>(Create)->GetFunction());
    NanAssignPersistent<Function>(constructor, f);
    exports->Set(NanNew("AFArray"), f);
}

v8::Local<Object> ArrayWrapper::New(af::array* array)
{
    assert(array);
    Local<Value> args[] = { WrapPointer(array) };
    auto c = NanNew(constructor);
    auto inst = c->NewInstance(1, args);
    assert(ObjectWrap::Unwrap<ArrayWrapper>(inst)->array == array);
    return inst;
}

void ArrayWrapper::NewAsync(const v8::FunctionCallbackInfo<v8::Value>& args, std::function<af::array*()> arrayFactory)
{
    if (args.Length() >= 1 && args[args.Length() - 1]->IsFunction())
    {
        auto callback = new NanCallback(args[args.Length() - 1].As<Function>());
        auto worker = new Worker<af::array*>(callback, arrayFactory, [](af::array* a){ return ArrayWrapper::New(a); });
        NanAsyncQueueWorker(worker);
        NanReturnUndefined();
    }
    else
    {
        NanThrowError("Last argument have to be a callback!");
    }
}

af::array* ArrayWrapper::GetArray(v8::Local<v8::Value> value)
{
    try
    {
        if (value->IsObject())
        {
            auto wrapper = ObjectWrap::Unwrap<ArrayWrapper>(value.As<Object>());
            if (wrapper) return wrapper->array;
        }
    }
    catch (...)
    {
    }
    throw logic_error("Argument is not an AFArray instance.");
}

af::array* ArrayWrapper::GetArrayAt(const v8::FunctionCallbackInfo<v8::Value>& args, int index)
{
    if (index < args.Length())
    {
        return GetArray(args[index]);
    }
    stringstream ss;
    ss << "Argument at position " << to_string(index) << ". is not an AFArray instance.";
    throw logic_error(ss.str().c_str());
}

void ArrayWrapper::New(const v8::FunctionCallbackInfo<v8::Value> &args)
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
            return NanThrowError("Invalid arguments.");
        }

        instance->Wrap(args.Holder());

        //Set instance props: NanObjectWrapHandle(obj)->Set(NanNew(symbol), value);

        NanReturnValue(args.Holder());
    }
    FIRE_CATCH
}

template<typename T>
af::array* ArrayWrapper::CreateArray(void* ptr, af::af_source_t src, const af::dim4& dim4)
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
            return NanThrowError("Buffer argument expected.");
        }
        else if (buffIdx + 1 < args.Length())
        {
            // Copy / wrap ptr
            // args: dim0..dimn, dtype, ptr[, source]
            af::af_source_t src = af::afHost;
            if (buffIdx + 1 < args.Length() && args[buffIdx + 1]->IsNumber())
            {
                src = (af::af_source_t)(args[buffIdx + 2]->Int32Value());
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
                    factory = [=]() { return CreateArray<af_cfloat>(ptr, src, dimAndType.first); };
                    break;
                case c64:
                    factory = [=]() { return CreateArray<af_cdouble>(ptr, src, dimAndType.first); };
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
            }
        }

        if (!factory)
        {
            return NanThrowError("Invalid arguments.");
        }

        NanCallback *callback = nullptr;
        if (args[args.Length() - 1]->IsFunction())
        {
            callback = new NanCallback(args[args.Length() - 1].As<Function>());
        }

        if (!callback)
        {
            return NanThrowError("Callback argument expected.");
        }

        auto conv = [](af::array* w)
        {
            return New(w);
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
        NanReturnValue(NanNew(GetArray(args.This())->elements()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::Host)
{
    NanScope();

    try
    {
        if (!(args.Length() && Buffer::HasInstance(args[0])))
        {
            return NanThrowError("Buffer argument expected.");
        }

        auto buffSize = Buffer::Length(args[0]);
        auto buffData = Buffer::Data(args[0]);

        auto pArray = GetArray(args.This());
        if (buffSize < pArray->bytes())
        {
            return NanThrowError("Buffer is too small to hold values.");
        }

        NanCallback *callback = nullptr;
        if (args.Length() > 1 && args[1]->IsFunction())
        {
            callback = new NanCallback(args[1].As<Function>());
        }

        if (!callback)
        {
            return NanThrowError("Callback argument expected.");
        }

        af::array array(*pArray);
        auto exec = [=]()
        {
            Guard();
            array.host(buffData);
        };
        auto worker = new Worker<void>(callback, move(exec));
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
        Guard();
        NanReturnValue(GetArray(args.This())->type());
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::Dims)
{
    NanScope();

    try
    {
        Guard();

        auto pArray = GetArray(args.This());
        if (!args.Length())
        {
            auto dims = pArray->dims();
            auto jsDims = NanNew<Object>();
            jsDims->Set(NanNew("elements"), NanNew(dims.elements()));
            jsDims->Set(NanNew("ndims"), NanNew(dims.ndims()));
            jsDims->Set(NanNew("dim0"), NanNew(dims[0]));
            jsDims->Set(NanNew("dim1"), NanNew(dims[1]));
            jsDims->Set(NanNew("dim2"), NanNew(dims[2]));
            jsDims->Set(NanNew("dim3"), NanNew(dims[3]));
            auto pDims = NanNew<Array>(4);
            pDims->Set(0, NanNew(dims[0]));
            pDims->Set(1, NanNew(dims[1]));
            pDims->Set(2, NanNew(dims[2]));
            pDims->Set(3, NanNew(dims[3]));
            jsDims->Set(NanNew("dims"), pDims);

            NanReturnValue(jsDims);
        }
        else
        {
            NanReturnValue(pArray->dims(args[0]->Uint32Value()));
        }
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::NumDims)
{
    NanScope();

    try
    {
        Guard();
        NanReturnValue(NanNew(GetArray(args.This())->numdims()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::Bytes)
{
    NanScope();

    try
    {
        Guard();
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
        auto result = New(new af::array(move(GetArray(args.This())->copy())));

        NanReturnValue(result);
    }
    FIRE_CATCH;
}

NAN_METHOD(ArrayWrapper::IsEmpty)
{
    NanScope();

    try
    {
        Guard();
        NanReturnValue(NanNew(GetArray(args.This())->isempty()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsScalar)
{
    NanScope();

    try
    {
        Guard();
        NanReturnValue(NanNew(GetArray(args.This())->isscalar()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsVector)
{
    NanScope();

    try
    {
        Guard();
        NanReturnValue(NanNew(GetArray(args.This())->isvector()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsRow)
{
    NanScope();

    try
    {
        Guard();
        NanReturnValue(NanNew(GetArray(args.This())->isrow()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsColumn)
{
    NanScope();

    try
    {
        Guard();
        NanReturnValue(NanNew(GetArray(args.This())->iscolumn()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsComplex)
{
    NanScope();

    try
    {
        Guard();
        NanReturnValue(NanNew(GetArray(args.This())->iscomplex()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsReal)
{
    NanScope();

    try
    {
        Guard();
        NanReturnValue(NanNew(GetArray(args.This())->isreal()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsDouble)
{
    NanScope();

    try
    {
        Guard();
        NanReturnValue(NanNew(GetArray(args.This())->isdouble()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsSingle)
{
    NanScope();

    try
    {
        Guard();
        NanReturnValue(NanNew(GetArray(args.This())->issingle()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsRealFloating)
{
    NanScope();

    try
    {
        Guard();
        NanReturnValue(NanNew(GetArray(args.This())->isrealfloating()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsFloating)
{
    NanScope();

    try
    {
        Guard();
        NanReturnValue(NanNew(GetArray(args.This())->isfloating()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsInteger)
{
    NanScope();

    try
    {
        Guard();
        NanReturnValue(NanNew(GetArray(args.This())->isinteger()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsBool)
{
    NanScope();

    try
    {
        Guard();
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
