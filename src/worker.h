/*
Copyright 2015 Gábor Mező aka unbornchikken (gabor.mezo@outlook.com)

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

#ifndef ARRAY_FIRE_JS_WORKER_H
#define ARRAY_FIRE_JS_WORKER_H

#include <functional>
#include <nan.h>
#include <exception>
#include "helpers.h"

inline NAN_METHOD(Noop)
{
    NanScope();
    NanReturnUndefined();
}

template<typename T>
struct Worker : public NanAsyncWorker
{
    typedef std::function<T()> ExecuteFunc;
    typedef std::function<v8::Local<v8::Value>(Worker<T>*, T)> ResultConvFunc;

    Worker(NanCallback *callback, const ExecuteFunc& executeFunc, const ResultConvFunc& resultConvFunc) :
        NanAsyncWorker(callback ? callback : new NanCallback(NanNew<v8::FunctionTemplate>(Noop)->GetFunction())),
        executeFunc(executeFunc),
        resultConvFunc(ConvResult(resultConvFunc))
    {
    }

    Worker(NanCallback *callback, const ExecuteFunc& executeFunc) :
        NanAsyncWorker(callback ? callback : new NanCallback(NanNew<v8::FunctionTemplate>(Noop)->GetFunction())),
        executeFunc(executeFunc),
        resultConvFunc(ConvResult([](Worker<T>* w, T v) { return NanNew(v); }))
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
        NanScope();
        auto convertedResult = resultConvFunc(this, result);
        if (convertedResult->IsNativeError())
        {
            Local<Value> args[] = { convertedResult };
            callback->Call(1, args);
        }
        else
        {
            Local<Value> args[] = { NanNull(), convertedResult };
            callback->Call(2, args);
        }
    }

private:
    ExecuteFunc executeFunc;
    ResultConvFunc resultConvFunc;
    T result;

    ResultConvFunc ConvResult(const ResultConvFunc& resultConvFunc)
    {
        return [=](Worker<T>* i, T result)
        {
            try
            {
                return resultConvFunc(i, result);
            }
            catch(af::exception& ex)
            {
                return NanError(ex.what());
            }
            catch(std::exception& ex)
            {
                return NanError(ex.what());
            }
            catch(...)
            {
                return NanError("Unknown error!");
            }
        };
    }
};

template<>
struct Worker<void> : public NanAsyncWorker
{
    typedef std::function<void()> ExecuteFunc;

    Worker(NanCallback *callback, const ExecuteFunc& executeFunc) :
        NanAsyncWorker(callback ? callback : new NanCallback(NanNew<v8::FunctionTemplate>(Noop)->GetFunction())),
        executeFunc(executeFunc)
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
