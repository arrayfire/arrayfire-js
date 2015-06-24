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
        ARGS_LEN(3);

        af::dtype dim = GetDTypeInfo(args[0]).first;
        auto pArray1 = ArrayWrapper::GetArrayAt(args, 1);
        auto pArray2 = ArrayWrapper::GetArrayAt(args, 2);
        Guard();
        NanReturnValue(ArrayWrapper::New(af::join(dim, *pArray1, *pArray2)));;
    }
    FIRE_CATCH
}

FIRE_SYNC_METHOD_XYZW(Tile, tile, 1, 1, 1)

FIRE_SYNC_METHOD_XYZW(Reorder, reorder, 1, 2, 3)

FIRE_SYNC_METHOD_XYZW(Shift, shift, 0, 0, 0)

FIRE_SYNC_METHOD_XYZW(ModDims, moddims, 1, 1, 1)

FIRE_SYNC_METHOD_ARR(Flat, flat)

NAN_METHOD(Flip)
{
    NanScope();

    try
    {
        ARGS_LEN(2);

        auto pArray = ArrayWrapper::GetArrayAt(args, 0);
        af::dtype dim = GetDTypeInfo(args[1]).first;
        Guard();
        NanReturnValue(ArrayWrapper::New(af::flip(*pArray, dim)));;
    }
    FIRE_CATCH
}

FIRE_SYNC_METHOD_ARR_BOOL(Transpose, transpose, false)

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
