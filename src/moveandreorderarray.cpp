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
    try
    {
        ARGS_LEN(3);

        af::dtype dim = GetDTypeInfo(info[0]).first;
        auto pArray1 = ArrayWrapper::GetArrayAt(info, 1);
        auto pArray2 = ArrayWrapper::GetArrayAt(info, 2);
        Guard guard;
        info.GetReturnValue().Set(ArrayWrapper::New(af::join(dim, *pArray1, *pArray2)));;
    }
    ARRAYFIRE_CATCH
}

AF_SM_XYZW(Tile, tile, 1, 1, 1)

AF_SM_XYZW(Reorder, reorder, 1, 2, 3)

AF_SM_XYZW(Shift, shift, 0, 0, 0)

AF_SM_XYZW(ModDims, moddims, 1, 1, 1)

AF_SM_ARR(Flat, flat)

NAN_METHOD(Flip)
{
    try
    {
        ARGS_LEN(2);

        auto pArray = ArrayWrapper::GetArrayAt(info, 0);
        af::dtype dim = GetDTypeInfo(info[1]).first;
        Guard guard;
        info.GetReturnValue().Set(ArrayWrapper::New(af::flip(*pArray, dim)));;
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(Select)
{
    try
    {
        ARGS_LEN(3);

        auto pArray = ArrayWrapper::GetArrayAt(info, 0);
        auto pArray1 = ArrayWrapper::TryGetArrayAt(info, 1);
        auto pArray2 = ArrayWrapper::TryGetArrayAt(info, 2);
        Guard guard;
        if (pArray1 && pArray2)
        {
            info.GetReturnValue().Set(ArrayWrapper::New(af::select(*pArray, *pArray1, *pArray2)));
        }
        else if (pArray1 && info[2]->IsNumber())
        {
            info.GetReturnValue().Set(ArrayWrapper::New(af::select(*pArray, *pArray1, info[2]->NumberValue())));
        }
        else if (pArray2 && info[1]->IsNumber())
        {
            info.GetReturnValue().Set(ArrayWrapper::New(af::select(*pArray, info[1]->NumberValue(), *pArray2)));
        }
        else
        {
            NAN_THROW_INVALID_ARGS();
        }
    }
    ARRAYFIRE_CATCH
}

NAN_MODULE_INIT(InitMoveAndReorderArray)
{
    Nan::HandleScope scope;

    Nan::Set(target, Nan::New<String>("join").ToLocalChecked(),
        Nan::New<FunctionTemplate>(Join)->GetFunction());

    Nan::Set(target, Nan::New<String>("tile").ToLocalChecked(),
        Nan::New<FunctionTemplate>(Tile)->GetFunction());

    Nan::Set(target, Nan::New<String>("reorder").ToLocalChecked(),
        Nan::New<FunctionTemplate>(Reorder)->GetFunction());

    Nan::Set(target, Nan::New<String>("shift").ToLocalChecked(),
        Nan::New<FunctionTemplate>(Shift)->GetFunction());

    Nan::Set(target, Nan::New<String>("moddims").ToLocalChecked(),
        Nan::New<FunctionTemplate>(ModDims)->GetFunction());

    Nan::Set(target, Nan::New<String>("modDims").ToLocalChecked(),
        Nan::New<FunctionTemplate>(ModDims)->GetFunction());

    Nan::Set(target, Nan::New<String>("flat").ToLocalChecked(),
        Nan::New<FunctionTemplate>(Flat)->GetFunction());

    Nan::Set(target, Nan::New<String>("flip").ToLocalChecked(),
        Nan::New<FunctionTemplate>(Flip)->GetFunction());

    Nan::Set(target, Nan::New<String>("select").ToLocalChecked(),
        Nan::New<FunctionTemplate>(Select)->GetFunction());
}
