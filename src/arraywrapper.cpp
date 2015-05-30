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
    Local<Value> args[] = { WrapPointer(array) };
    auto c = NanNew(constructor);
    auto inst = c->NewInstance(1, args);
    assert(ObjectWrap::Unwrap<ArrayWrapper>(inst)->array == array);    
    return inst;
}

template<typename T>
af::array* ArrayWrapper::CreateArray(void* ptr, af::af_source_t src, int dimensions, const vector<dim_type> &dims)
{
    Guard();
    switch (dimensions)
    {
        case 1:
            return new af::array(dims[0], (T*)ptr, src);
            break;
        case 2:
            return new af::array(dims[0], dims[1], (T*)ptr, src);
            break;
        case 3:
            return new af::array(dims[0], dims[1], dims[2], (T*)ptr, src);
            break;
        case 4:
            {
                return new af::array(af::dim4(dims[0], dims[1], dims[2], dims[3]), (T*)ptr, src);
            }
            break;
    }
    return nullptr;
}

void ArrayWrapper::New(const v8::FunctionCallbackInfo<v8::Value> &args)
{
    NanScope();

    int buffIdx = -1;
    ArrayWrapper* instance = nullptr;
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
                int dimensions = args.Length() - 1;
                af::dtype type = ConvDtype(args[args.Length() - 1]->Uint32Value()).first;
                switch (dimensions)
                {
                    case 1:
                        instance = new ArrayWrapper(new af::array((dim_type)args[0]->Int32Value(), type));
                        break;
                    case 2:
                        instance = new ArrayWrapper(new af::array((dim_type)args[0]->Int32Value(), (dim_type)args[1]->Int32Value(), type));
                        break;
                    case 3:
                        instance = new ArrayWrapper(new af::array((dim_type)args[0]->Int32Value(), (dim_type)args[1]->Int32Value(), (dim_type)args[2]->Int32Value(), type));
                        break;
                    case 4:
                        {
                            af::dim4 d((dim_type)args[0]->Int32Value(), (dim_type)args[1]->Int32Value(), (dim_type)args[2]->Int32Value(), (dim_type)args[3]->Int32Value());
                            instance = new ArrayWrapper(new af::array(d, type));
                        }
                        break;
                }
            }
        }
    }
    catch (exception& ex)
    {
        delete instance;
        return NanThrowError(ex.what());
    }

    if (!instance)
    {
        return NanThrowError("Invalid arguments.");
    }

    instance->Wrap(args.Holder());

    //Set instance props: NanObjectWrapHandle(obj)->Set(NanNew(symbol), value);

    NanReturnValue(args.Holder());
}

NAN_METHOD(ArrayWrapper::Create)
{
    NanScope();

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
        // args: dim0..dimn, ptr, dtype[, source]
        af::af_source_t src = af::afHost;
        if (buffIdx + 2 < args.Length() && args[buffIdx + 2]->IsNumber())
        {
            src = (af::af_source_t)(args[buffIdx + 2]->Int32Value());
        }
        int dimensions = buffIdx;
        af::dtype type = ConvDtype(args[buffIdx + 1]->Uint32Value()).first;
        auto buffObj = args[buffIdx]->ToObject();
        char* ptr = Buffer::Data(buffObj);
        vector<dim_type> dims = { args[0]->Int32Value() };
        if (dimensions > 1)  dims.push_back(args[1]->Int32Value());
        if (dimensions > 2)  dims.push_back(args[2]->Int32Value());
        if (dimensions > 3)  dims.push_back(args[3]->Int32Value());
        switch (type)
        {
            case f32:
                factory = [=]() { return CreateArray<float>(ptr, src, dimensions, dims); };
                break;
            case f64:
                factory = [=]() { return CreateArray<double>(ptr, src, dimensions, dims); };
                break;
            case s32:
                factory = [=]() { return CreateArray<int>(ptr, src, dimensions, dims); };
                break;
            case u32:
                factory = [=]() { return CreateArray<unsigned>(ptr, src, dimensions, dims); };
                break;
            case u8:
                factory = [=]() { return CreateArray<unsigned char>(ptr, src, dimensions, dims); };
                break;
            case c32:
                factory = [=]() { return CreateArray<af_cfloat>(ptr, src, dimensions, dims); };
                break;
            case c64:
                factory = [=]() { return CreateArray<af_cdouble>(ptr, src, dimensions, dims); };
                break;
            case b8:
                factory = [=]() { return CreateArray<char>(ptr, src, dimensions, dims); };
                break;
            case s64:
                factory = [=]() { return CreateArray<int64_t>(ptr, src, dimensions, dims); };
                break;
            case u64:
                factory = [=]() { return CreateArray<uint64_t>(ptr, src, dimensions, dims); };
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

    auto worker = new Worker<af::array*>(callback, factory, 
    [](af::array* w)
    { 
        return New(w);
    });
    worker->SaveToPersistent("data", args[buffIdx]->ToObject());

    NanAsyncQueueWorker(worker);
    NanReturnUndefined();
}

NAN_METHOD(ArrayWrapper::Elements)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew(obj->array->elements()));
}

NAN_METHOD(ArrayWrapper::Host)
{
    NanScope();

    if (!(args.Length() && Buffer::HasInstance(args[0])))
    {
        return NanThrowError("Buffer argument expected.");
    }

    auto buffSize = Buffer::Length(args[0]);
    auto buffData = Buffer::Data(args[0]);

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());
    if (buffSize < obj->array->bytes())
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

    auto array = obj->array;
    auto exec = [=]()
    {
        Guard();
        array->host(buffData);
    };
    auto worker = new Worker<void>(callback, exec);
    worker->SaveToPersistent("data", args[0]->ToObject());

    NanAsyncQueueWorker(worker);
    NanReturnUndefined();
}

NAN_METHOD(ArrayWrapper::Type)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(obj->array->type());
}

NAN_METHOD(ArrayWrapper::Dims)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());
    if (!args.Length())
    {
        auto dims = obj->array->dims();
        auto jsDims = NanNew<Object>();
        jsDims->Set(NanNew("elements"), NanNew(dims.elements()));
        jsDims->Set(NanNew("ndims"), NanNew(dims.ndims()));
        jsDims->Set(NanNew("dim0"), NanNew(dims[0]));
        jsDims->Set(NanNew("dim1"), NanNew(dims[1]));
        jsDims->Set(NanNew("dim2"), NanNew(dims[2]));
        jsDims->Set(NanNew("dim3"), NanNew(dims[3]));

        NanReturnValue(jsDims);
    }
    else
    {
        NanReturnValue(obj->array->dims(args[0]->Uint32Value()));
    }
}

NAN_METHOD(ArrayWrapper::NumDims)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew(obj->array->numdims()));
}

NAN_METHOD(ArrayWrapper::Bytes)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew<Number>((unsigned)obj->array->bytes()));
}

NAN_METHOD(ArrayWrapper::Copy)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());
    auto result = New(new af::array(obj->array->copy()));

    NanReturnValue(result);
}

NAN_METHOD(ArrayWrapper::IsEmpty)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew(obj->array->isempty()));
}

NAN_METHOD(ArrayWrapper::IsScalar)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew(obj->array->isscalar()));
}

NAN_METHOD(ArrayWrapper::IsVector)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew(obj->array->isvector()));
}

NAN_METHOD(ArrayWrapper::IsRow)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew(obj->array->isrow()));
}

NAN_METHOD(ArrayWrapper::IsColumn)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew(obj->array->iscolumn()));
}

NAN_METHOD(ArrayWrapper::IsComplex)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew(obj->array->iscomplex()));
}

NAN_METHOD(ArrayWrapper::IsReal)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew(obj->array->isreal()));
}

NAN_METHOD(ArrayWrapper::IsDouble)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew(obj->array->isdouble()));
}

NAN_METHOD(ArrayWrapper::IsSingle)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew(obj->array->issingle()));
}

NAN_METHOD(ArrayWrapper::IsRealFloating)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew(obj->array->isrealfloating()));
}

NAN_METHOD(ArrayWrapper::IsFloating)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew(obj->array->isfloating()));
}

NAN_METHOD(ArrayWrapper::IsInteger)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew(obj->array->isinteger()));
}

NAN_METHOD(ArrayWrapper::IsBool)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew(obj->array->type() == b8));
}

NAN_METHOD(ArrayWrapper::Eval)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());
    obj->array->eval();

    NanReturnUndefined();
}
