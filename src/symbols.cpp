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
#include "symbols.h"

using namespace v8;
using namespace std;
using namespace node;

Persistent<String> Symbols::Dims;
Persistent<String> Symbols::Begin;
Persistent<String> Symbols::End;
Persistent<String> Symbols::Step;
Persistent<String> Symbols::IsGFor;
Persistent<String> Symbols::Imag;
Persistent<String> Symbols::Real;
Persistent<String> Symbols::Elements;
Persistent<String> Symbols::Ndims;
Persistent<String> Symbols::NDims;
Persistent<String> Symbols::Name;
Persistent<String> Symbols::Platform;
Persistent<String> Symbols::Toolkit;
Persistent<String> Symbols::Compute;
Persistent<String> Symbols::IsDoubleAvailable;
Persistent<String> Symbols::Cpu;
Persistent<String> Symbols::Index;
Persistent<String> Symbols::Value;
Persistent<String> Symbols::Keys;
Persistent<String> Symbols::Values;
Persistent<String> Symbols::Feat;
Persistent<String> Symbols::Desc;
Persistent<String> Symbols::Indices;
Persistent<String> Symbols::DX;
Persistent<String> Symbols::DY;
Persistent<String> Symbols::NumFeatures;
Persistent<String> Symbols::X;
Persistent<String> Symbols::Y;
Persistent<String> Symbols::Score;
Persistent<String> Symbols::Orientation;
Persistent<String> Symbols::Size;
Persistent<String> Symbols::Idx;
Persistent<String> Symbols::Dist;

void Symbols::Init()
{
    NanAssignPersistent(Dims, NanNew("dims"));
    NanAssignPersistent(Begin, NanNew("begin"));
    NanAssignPersistent(End, NanNew("end"));
    NanAssignPersistent(Step, NanNew("step"));
    NanAssignPersistent(IsGFor, NanNew("IsGFor"));
    NanAssignPersistent(Imag, NanNew("imag"));
    NanAssignPersistent(Real, NanNew("real"));
    NanAssignPersistent(Elements, NanNew("elements"));
    NanAssignPersistent(Ndims, NanNew("ndims"));
    NanAssignPersistent(NDims, NanNew("nDims"));
    NanAssignPersistent(Name, NanNew("name"));
    NanAssignPersistent(Platform, NanNew("platform"));
    NanAssignPersistent(Toolkit, NanNew("toolkit"));
    NanAssignPersistent(Compute, NanNew("compute"));
    NanAssignPersistent(IsDoubleAvailable, NanNew("isDoubleAvailable"));
    NanAssignPersistent(Cpu, NanNew("CPU"));
    NanAssignPersistent(Index, NanNew("index"));
    NanAssignPersistent(Value, NanNew("value"));
    NanAssignPersistent(Keys, NanNew("keys"));
    NanAssignPersistent(Values, NanNew("values"));
    NanAssignPersistent(Feat, NanNew("feat"));
    NanAssignPersistent(Desc, NanNew("desc"));
    NanAssignPersistent(Indices, NanNew("indices"));
    NanAssignPersistent(DX, NanNew("dx"));
    NanAssignPersistent(DY, NanNew("dy"));
    NanAssignPersistent(NumFeatures, NanNew("numFeatures"));
    NanAssignPersistent(X, NanNew("x"));
    NanAssignPersistent(Y, NanNew("y"));
    NanAssignPersistent(Score, NanNew("score"));
    NanAssignPersistent(Orientation, NanNew("orientation"));
    NanAssignPersistent(Size, NanNew("size"));
    NanAssignPersistent(Idx, NanNew("idx"));
    NanAssignPersistent(Dist, NanNew("dist"));
}
