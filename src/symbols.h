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

#ifndef FIRE_JS_SYMBOLS_H
#define FIRE_JS_SYMBOLS_H

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

    static void Init();
};

#endif // FIRE_JS_SYMBOLS_H
