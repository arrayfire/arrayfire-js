/*
Copyright (c) 2014-2015->Reset(ArrayFire
Copyright (c) 2015 Gábor Mező aka unbornchikken (gabor.mezo@outlook.com)
All rights reserved.

Redistribution and use in source and binary forms->Reset(with or without modification,
are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice->Reset(this
  list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright notice->Reset(this
  list of conditions and the following disclaimer in the documentation and/or
  other materials provided with the distribution.

 * Neither the name of the ArrayFire nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES->Reset(INCLUDING->Reset(BUT NOT LIMITED TO->Reset(THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT->Reset(INDIRECT->Reset(INCIDENTAL->Reset(SPECIAL->Reset(EXEMPLARY->Reset(OR CONSEQUENTIAL DAMAGES
(INCLUDING->Reset(BUT NOT LIMITED TO->Reset(PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE->Reset(DATA->Reset(OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY->Reset(WHETHER IN CONTRACT->Reset(STRICT LIABILITY->Reset(OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE->Reset(EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

#include "ext.h"
#include "symbols.h"

using namespace v8;
using namespace std;
using namespace node;

Nan::Persistent<String> Symbols::Dims;
Nan::Persistent<String> Symbols::Begin;
Nan::Persistent<String> Symbols::End;
Nan::Persistent<String> Symbols::Step;
Nan::Persistent<String> Symbols::IsGFor;
Nan::Persistent<String> Symbols::Imag;
Nan::Persistent<String> Symbols::Real;
Nan::Persistent<String> Symbols::Elements;
Nan::Persistent<String> Symbols::Ndims;
Nan::Persistent<String> Symbols::NDims;
Nan::Persistent<String> Symbols::Name;
Nan::Persistent<String> Symbols::Platform;
Nan::Persistent<String> Symbols::Toolkit;
Nan::Persistent<String> Symbols::Compute;
Nan::Persistent<String> Symbols::IsDoubleAvailable;
Nan::Persistent<String> Symbols::Cpu;
Nan::Persistent<String> Symbols::Index;
Nan::Persistent<String> Symbols::Value;
Nan::Persistent<String> Symbols::Keys;
Nan::Persistent<String> Symbols::Values;
Nan::Persistent<String> Symbols::Feat;
Nan::Persistent<String> Symbols::Desc;
Nan::Persistent<String> Symbols::Indices;
Nan::Persistent<String> Symbols::DX;
Nan::Persistent<String> Symbols::DY;
Nan::Persistent<String> Symbols::NumFeatures;
Nan::Persistent<String> Symbols::X;
Nan::Persistent<String> Symbols::Y;
Nan::Persistent<String> Symbols::Score;
Nan::Persistent<String> Symbols::Orientation;
Nan::Persistent<String> Symbols::Size;
Nan::Persistent<String> Symbols::Idx;
Nan::Persistent<String> Symbols::Dist;
Nan::Persistent<String> Symbols::Succeeded;
Nan::Persistent<String> Symbols::Result;
Nan::Persistent<String> Symbols::Upper;
Nan::Persistent<String> Symbols::Lower;
Nan::Persistent<String> Symbols::Pivot;
Nan::Persistent<String> Symbols::Q;
Nan::Persistent<String> Symbols::R;
Nan::Persistent<String> Symbols::Tau;
Nan::Persistent<String> Symbols::FirstIndex;
Nan::Persistent<String> Symbols::LastIndex;
Nan::Persistent<String> Symbols::RowClass;
Nan::Persistent<String> Symbols::RowsClass;
Nan::Persistent<String> Symbols::ColClass;
Nan::Persistent<String> Symbols::ColsClass;
Nan::Persistent<String> Symbols::SliceClass;
Nan::Persistent<String> Symbols::SlicesClass;
Nan::Persistent<String> Symbols::FailedAtRank;
Nan::Persistent<String> Symbols::AFArrayClass;

void Symbols::Init()
{
    Nan::HandleScope scope;

    Dims.Reset(Nan::New("dims").ToLocalChecked());
    Begin.Reset(Nan::New("begin").ToLocalChecked());
    End.Reset(Nan::New("end").ToLocalChecked());
    Step.Reset(Nan::New("step").ToLocalChecked());
    IsGFor.Reset(Nan::New("IsGFor").ToLocalChecked());
    Imag.Reset(Nan::New("imag").ToLocalChecked());
    Real.Reset(Nan::New("real").ToLocalChecked());
    Elements.Reset(Nan::New("elements").ToLocalChecked());
    Ndims.Reset(Nan::New("ndims").ToLocalChecked());
    NDims.Reset(Nan::New("nDims").ToLocalChecked());
    Name.Reset(Nan::New("name").ToLocalChecked());
    Platform.Reset(Nan::New("platform").ToLocalChecked());
    Toolkit.Reset(Nan::New("toolkit").ToLocalChecked());
    Compute.Reset(Nan::New("compute").ToLocalChecked());
    IsDoubleAvailable.Reset(Nan::New("isDoubleAvailable").ToLocalChecked());
    Cpu.Reset(Nan::New("CPU").ToLocalChecked());
    Index.Reset(Nan::New("index").ToLocalChecked());
    Value.Reset(Nan::New("value").ToLocalChecked());
    Keys.Reset(Nan::New("keys").ToLocalChecked());
    Values.Reset(Nan::New("values").ToLocalChecked());
    Feat.Reset(Nan::New("feat").ToLocalChecked());
    Desc.Reset(Nan::New("desc").ToLocalChecked());
    Indices.Reset(Nan::New("indices").ToLocalChecked());
    DX.Reset(Nan::New("dx").ToLocalChecked());
    DY.Reset(Nan::New("dy").ToLocalChecked());
    NumFeatures.Reset(Nan::New("numFeatures").ToLocalChecked());
    X.Reset(Nan::New("x").ToLocalChecked());
    Y.Reset(Nan::New("y").ToLocalChecked());
    Score.Reset(Nan::New("score").ToLocalChecked());
    Orientation.Reset(Nan::New("orientation").ToLocalChecked());
    Size.Reset(Nan::New("size").ToLocalChecked());
    Idx.Reset(Nan::New("idx").ToLocalChecked());
    Dist.Reset(Nan::New("dist").ToLocalChecked());
    Succeeded.Reset(Nan::New("succeeded").ToLocalChecked());
    Result.Reset(Nan::New("result").ToLocalChecked());
    Upper.Reset(Nan::New("upper").ToLocalChecked());
    Lower.Reset(Nan::New("lower").ToLocalChecked());
    Pivot.Reset(Nan::New("pivot").ToLocalChecked());
    Q.Reset(Nan::New("q").ToLocalChecked());
    R.Reset(Nan::New("r").ToLocalChecked());
    Tau.Reset(Nan::New("tau").ToLocalChecked());
    FirstIndex.Reset(Nan::New("firstIndex").ToLocalChecked());
    LastIndex.Reset(Nan::New("lastIndex").ToLocalChecked());
    RowClass.Reset(Nan::New("Row").ToLocalChecked());
    RowsClass.Reset(Nan::New("Rows").ToLocalChecked());
    ColClass.Reset(Nan::New("Col").ToLocalChecked());
    ColsClass.Reset(Nan::New("Cols").ToLocalChecked());
    SliceClass.Reset(Nan::New("Slice").ToLocalChecked());
    SlicesClass.Reset(Nan::New("Slices").ToLocalChecked());
    FailedAtRank.Reset(Nan::New("failedAtRank").ToLocalChecked());
    AFArrayClass.Reset(Nan::New("AFArray").ToLocalChecked());
}
