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

#ifndef ARRAY_ARRAYFIRE_JS_WORKER_H
#define ARRAY_ARRAYFIRE_JS_WORKER_H

#include <functional>
#include <nan.h>
#include <exception>
#include "helpers.h"

inline NAN_METHOD(Noop)
{

    info.GetReturnValue().SetUndefined();
}

template<typename T>
struct Worker : public Nan::AsyncWorker
{
    typedef std::function<T()> ExecuteFunc;
    typedef std::function<v8::Local<v8::Value>(Worker<T>*, T)> ResultConvFunc;

    Worker(Nan::Callback *callback, const ExecuteFunc& executeFunc, const ResultConvFunc& resultConvFunc) :
        Nan::AsyncWorker(callback ? callback : new Nan::Callback(Nan::New<v8::FunctionTemplate>(Noop)->GetFunction())),
        executeFunc(executeFunc),
        resultConvFunc(std::move(ConvResult(resultConvFunc)))
    {
    }

    Worker(Nan::Callback *callback, const ExecuteFunc& executeFunc) :
        Nan::AsyncWorker(callback ? callback : new Nan::Callback(Nan::New<v8::FunctionTemplate>(Noop)->GetFunction())),
        executeFunc(executeFunc),
        resultConvFunc(std::move(ConvResult([](Worker<T>* w, T v) { return Nan::New(v); })))
    {
    }

    Worker(Nan::Callback *callback, ExecuteFunc&& executeFunc, const ResultConvFunc& resultConvFunc) :
        Nan::AsyncWorker(callback ? callback : new Nan::Callback(Nan::New<v8::FunctionTemplate>(Noop)->GetFunction())),
        executeFunc(std::move(executeFunc)),
        resultConvFunc(std::move(ConvResult(resultConvFunc)))
    {
    }

    Worker(Nan::Callback *callback, ExecuteFunc&& executeFunc) :
        Nan::AsyncWorker(callback ? callback : new Nan::Callback(Nan::New<v8::FunctionTemplate>(Noop)->GetFunction())),
        executeFunc(std::move(executeFunc)),
        resultConvFunc(std::move(ConvResult([](Worker<T>* w, T v) { return Nan::New(v); })))
    {
    }

    void Execute() override
    {
        using namespace std;
        try
        {
            result = executeFunc();
        }
        catch(af::exception& ex)
        {
            SetErrorMessage(ex.what());
        }
        catch(std::exception& ex)
        {
            SetErrorMessage(ex.what());
        }
        catch(...)
        {
            SetErrorMessage("Unknown error!");
        }
    }

protected:
    void HandleOKCallback() override
    {
        using namespace v8;

        auto convertedResult = resultConvFunc(this, result);
        if (convertedResult->IsNativeError())
        {
            Local<Value> info[] = { convertedResult };
            callback->Call(1, info);
        }
        else
        {
            Local<Value> info[] = { Nan::Null(), convertedResult };
            callback->Call(2, info);
        }
    }

private:
    ExecuteFunc executeFunc;
    ResultConvFunc resultConvFunc;
    T result;

    ResultConvFunc ConvResult(const ResultConvFunc& resultConvFunc)
    {
        return std::move([=](Worker<T>* i, T result)
        {
            Nan::EscapableHandleScope scope;
            try
            {
                return scope.Escape(resultConvFunc(i, result));
            }
            catch(af::exception& ex)
            {
                return scope.Escape(Nan::Error(ex.what()));
            }
            catch(std::exception& ex)
            {
                return scope.Escape(Nan::Error(ex.what()));
            }
            catch(...)
            {
                return scope.Escape(Nan::Error("Unknown error!"));
            }
        });
    }
};

template<>
struct Worker<void> : public Nan::AsyncWorker
{
    typedef std::function<void()> ExecuteFunc;

    Worker(Nan::Callback *callback, const ExecuteFunc& executeFunc) :
        Nan::AsyncWorker(callback ? callback : new Nan::Callback(Nan::New<v8::FunctionTemplate>(Noop)->GetFunction())),
        executeFunc(executeFunc)
    {
    }

    Worker(Nan::Callback *callback, ExecuteFunc&& executeFunc) :
        Nan::AsyncWorker(callback ? callback : new Nan::Callback(Nan::New<v8::FunctionTemplate>(Noop)->GetFunction())),
        executeFunc(std::move(executeFunc))
    {
    }

    void Execute() override
    {
        using namespace std;
        try
        {
            executeFunc();
        }
        catch(af::exception& ex)
        {
            SetErrorMessage(ex.what());
        }
        catch(exception& ex)
        {
            SetErrorMessage(ex.what());
        }
        catch(...)
        {
            SetErrorMessage("Unknown error!");
        }
    }

private:
    ExecuteFunc executeFunc;
};

#endif
