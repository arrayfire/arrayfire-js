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

#ifndef ARRAYFIRE_JS_SYMBOLS_H
#define ARRAYFIRE_JS_SYMBOLS_H

#include <nan.h>

struct Symbols
{
    static Nan::Persistent<v8::String> Dims;
    static Nan::Persistent<v8::String> Begin;
    static Nan::Persistent<v8::String> End;
    static Nan::Persistent<v8::String> Step;
    static Nan::Persistent<v8::String> IsGFor;
    static Nan::Persistent<v8::String> Imag;
    static Nan::Persistent<v8::String> Real;
    static Nan::Persistent<v8::String> Elements;
    static Nan::Persistent<v8::String> Ndims;
    static Nan::Persistent<v8::String> NDims;
    static Nan::Persistent<v8::String> Name;
    static Nan::Persistent<v8::String> Platform;
    static Nan::Persistent<v8::String> Toolkit;
    static Nan::Persistent<v8::String> Compute;
    static Nan::Persistent<v8::String> IsDoubleAvailable;
    static Nan::Persistent<v8::String> Cpu;
    static Nan::Persistent<v8::String> Index;
    static Nan::Persistent<v8::String> Value;
    static Nan::Persistent<v8::String> Keys;
    static Nan::Persistent<v8::String> Values;
    static Nan::Persistent<v8::String> Feat;
    static Nan::Persistent<v8::String> Desc;
    static Nan::Persistent<v8::String> Indices;
    static Nan::Persistent<v8::String> DX;
    static Nan::Persistent<v8::String> DY;
    static Nan::Persistent<v8::String> NumFeatures;
    static Nan::Persistent<v8::String> X;
    static Nan::Persistent<v8::String> Y;
    static Nan::Persistent<v8::String> Score;
    static Nan::Persistent<v8::String> Orientation;
    static Nan::Persistent<v8::String> Size;
    static Nan::Persistent<v8::String> Idx;
    static Nan::Persistent<v8::String> Dist;
    static Nan::Persistent<v8::String> Succeeded;
    static Nan::Persistent<v8::String> Result;
    static Nan::Persistent<v8::String> Upper;
    static Nan::Persistent<v8::String> Lower;
    static Nan::Persistent<v8::String> Pivot;
    static Nan::Persistent<v8::String> Q;
    static Nan::Persistent<v8::String> R;
    static Nan::Persistent<v8::String> Tau;
    static Nan::Persistent<v8::String> FirstIndex;
    static Nan::Persistent<v8::String> LastIndex;
    static Nan::Persistent<v8::String> RowClass;
    static Nan::Persistent<v8::String> RowsClass;
    static Nan::Persistent<v8::String> ColClass;
    static Nan::Persistent<v8::String> ColsClass;
    static Nan::Persistent<v8::String> SliceClass;
    static Nan::Persistent<v8::String> SlicesClass;
    static Nan::Persistent<v8::String> FailedAtRank;
    static Nan::Persistent<v8::String> AFArrayClass;

    static void Init();
};

#endif // ARRAYFIRE_JS_SYMBOLS_H
