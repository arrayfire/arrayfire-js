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

#include "ext.h"
#include "moveandreorderarray.h"
#include "helpers.h"
#include "arraywrapper.h"
#include "errors.h"
#include "guard.h"

using namespace v8;
using namespace std;
using namespace node;

NAN_METHOD(Join)
{
    NanScope();

    try
    {
        ARGS_LEN(4);

        af::dtype dim = GetDTypeInfo(args[0]).first;
        af::array array1 = *ArrayWrapper::GetArrayAt(args, 1);
        af::array array2 = *ArrayWrapper::GetArrayAt(args, 2);

        return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(move(af::join(dim, array1, array2))); });
    }
    FIRE_CATCH
}

FIRE_ASYNC_METHOD_XYZW(Tile, tile, 1, 1, 1)

FIRE_ASYNC_METHOD_XYZW(Reorder, reorder, 1, 2, 3)

FIRE_ASYNC_METHOD_XYZW(Shift, shift, 0, 0, 0)

FIRE_ASYNC_METHOD_XYZW(ModDims, moddims, 1, 1, 1)

FIRE_ASYNC_METHOD_ARR(Flat, flat)

NAN_METHOD(Flip)
{
    NanScope();

    try
    {
        ARGS_LEN(3);

        af::array array = *ArrayWrapper::GetArrayAt(args, 0);
        af::dtype dim = GetDTypeInfo(args[1]).first;

        return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(move(af::flip(array, dim))); });
    }
    FIRE_CATCH
}

FIRE_ASYNC_METHOD_ARR_BOOL(Transpose, transpose, false)

void InitMoveAndReorderArray(v8::Handle<v8::Object> exports)
{
    exports->Set(NanNew("join"), NanNew<FunctionTemplate>(Join)->GetFunction());
    exports->Set(NanNew("tile"), NanNew<FunctionTemplate>(Tile)->GetFunction());
    exports->Set(NanNew("reorder"), NanNew<FunctionTemplate>(Reorder)->GetFunction());
    exports->Set(NanNew("shift"), NanNew<FunctionTemplate>(Shift)->GetFunction());
    exports->Set(NanNew("moddims"), NanNew<FunctionTemplate>(ModDims)->GetFunction());
    exports->Set(NanNew("modDims"), NanNew<FunctionTemplate>(ModDims)->GetFunction());
    exports->Set(NanNew("flat"), NanNew<FunctionTemplate>(Flat)->GetFunction());
    exports->Set(NanNew("flip"), NanNew<FunctionTemplate>(Flip)->GetFunction());
    exports->Set(NanNew("transpose"), NanNew<FunctionTemplate>(Transpose)->GetFunction());
}
