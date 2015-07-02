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
    static v8::Persistent<v8::String> Dims;
    static v8::Persistent<v8::String> Begin;
    static v8::Persistent<v8::String> End;
    static v8::Persistent<v8::String> Step;
    static v8::Persistent<v8::String> IsGFor;
    static v8::Persistent<v8::String> Imag;
    static v8::Persistent<v8::String> Real;
    static v8::Persistent<v8::String> Elements;
    static v8::Persistent<v8::String> Ndims;
    static v8::Persistent<v8::String> NDims;
    static v8::Persistent<v8::String> Name;
    static v8::Persistent<v8::String> Platform;
    static v8::Persistent<v8::String> Toolkit;
    static v8::Persistent<v8::String> Compute;
    static v8::Persistent<v8::String> IsDoubleAvailable;
    static v8::Persistent<v8::String> Cpu;
    static v8::Persistent<v8::String> Index;
    static v8::Persistent<v8::String> Value;
    static v8::Persistent<v8::String> Keys;
    static v8::Persistent<v8::String> Values;
    static v8::Persistent<v8::String> Feat;
    static v8::Persistent<v8::String> Desc;
    static v8::Persistent<v8::String> Indices;
    static v8::Persistent<v8::String> DX;
    static v8::Persistent<v8::String> DY;
    static v8::Persistent<v8::String> NumFeatures;
    static v8::Persistent<v8::String> X;
    static v8::Persistent<v8::String> Y;
    static v8::Persistent<v8::String> Score;
    static v8::Persistent<v8::String> Orientation;
    static v8::Persistent<v8::String> Size;
    static v8::Persistent<v8::String> Idx;
    static v8::Persistent<v8::String> Dist;
    static v8::Persistent<v8::String> Succeeded;
    static v8::Persistent<v8::String> Result;
    static v8::Persistent<v8::String> Upper;
    static v8::Persistent<v8::String> Lower;
    static v8::Persistent<v8::String> Pivot;
    static v8::Persistent<v8::String> Q;
    static v8::Persistent<v8::String> R;
    static v8::Persistent<v8::String> Tau;
    static v8::Persistent<v8::String> FirstIndex;
    static v8::Persistent<v8::String> LastIndex;
    static v8::Persistent<v8::String> RowClass;
    static v8::Persistent<v8::String> RowsClass;
    static v8::Persistent<v8::String> ColClass;
    static v8::Persistent<v8::String> ColsClass;
    static v8::Persistent<v8::String> SliceClass;
    static v8::Persistent<v8::String> SlicesClass;
    static v8::Persistent<v8::String> FailedAtRank;

    static void Init();
};

#endif // ARRAYFIRE_JS_SYMBOLS_H
