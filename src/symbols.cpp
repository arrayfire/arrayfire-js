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
}
