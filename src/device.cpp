#include "ext.h"
#include "device.h"
#include "guard.h"
#include "worker.h"

using namespace v8;
using namespace std;

NAN_METHOD(getDeviceCount)
{
    Guard();
    NanScope();
    NanReturnValue(NanNew<Number>(af::getDeviceCount()));
}

NAN_METHOD(getDevice)
{
    Guard();
    NanScope();

    NanReturnValue(NanNew<Number>(af::getDevice()));
}

NAN_METHOD(setDevice)
{
    Guard();
    NanScope();

    af::setDevice(args[0]->Uint32Value());
    NanReturnUndefined();
}

NAN_METHOD(getDeviceInfo)
{
    Guard();
    NanScope();

    char name[256], platform[256], toolkit[256], compute[256];
    af::deviceprop(name, platform, toolkit, compute);
    bool isDoubleAvailable = af::isDoubleAvailable(af::getDevice());
    auto info = NanNew<Object>();
    info->Set(NanNew<String>("name"), NanNew<String>(name));
    info->Set(NanNew<String>("platform"), NanNew<String>(platform));
    info->Set(NanNew<String>("toolkit"), NanNew<String>(toolkit));
    info->Set(NanNew<String>("compute"), NanNew<String>(compute));
    info->Set(NanNew<String>("isDoubleAvailable"), NanNew<Boolean>(isDoubleAvailable));

    NanReturnValue(info);
}

NAN_METHOD(isDoubleAvailable)
{
    Guard();
    NanScope();

    NanReturnValue(NanNew<Number>(af::isDoubleAvailable(args[0]->Uint32Value())));
}

NAN_METHOD(sync)
{
    NanScope();

    int device = -1;
    NanCallback *callback = nullptr;

    if (args.Length() > 0)
    {
        int idx = 0;
        if (args[idx]->IsNumber())
        {
            device = args[idx++]->Int32Value();
        }
        if (idx < args.Length() && args[idx]->IsFunction())
        {
            callback = new NanCallback(args[idx].As<Function>());
        }
    }

    auto exec = [=]()
    {
        Guard();
        af::sync(device);
    };

    NanAsyncQueueWorker(new Worker<void>(callback, exec));
    NanReturnUndefined();
}

void initDevice(v8::Handle<v8::Object> exports)
{
    exports->Set(NanNew<String>("getDeviceCount"), NanNew<FunctionTemplate>(getDeviceCount)->GetFunction());
    exports->Set(NanNew<String>("getDevice"), NanNew<FunctionTemplate>(getDevice)->GetFunction());
    exports->Set(NanNew<String>("setDevice"), NanNew<FunctionTemplate>(setDevice)->GetFunction());
    exports->Set(NanNew<String>("getDeviceInfo"), NanNew<FunctionTemplate>(getDeviceInfo)->GetFunction());
    exports->Set(NanNew<String>("isDoubleAvailable"), NanNew<FunctionTemplate>(isDoubleAvailable)->GetFunction());
    exports->Set(NanNew<String>("sync"), NanNew<FunctionTemplate>(sync)->GetFunction());
}
