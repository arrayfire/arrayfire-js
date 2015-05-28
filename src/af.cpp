#include "ext.h"
#include "af.h"
#include "device.h"
#include "arraywrapper.h"

using namespace v8;
using namespace af;

void Init(v8::Handle<v8::Object> exports)
{
    InitDevice(exports);
    ArrayWrapper::Init(exports);
}
