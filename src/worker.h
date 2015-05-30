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
    typedef std::function<v8::Local<v8::Value>(T)> ResultConvFunc;

    Worker(NanCallback *callback, const ExecuteFunc& executeFunc, const ResultConvFunc& resultConvFunc) :
        NanAsyncWorker(callback ? callback : new NanCallback(NanNew<v8::FunctionTemplate>(Noop)->GetFunction())),
        executeFunc(executeFunc),
        resultConvFunc(ConvResult(resultConvFunc))
    {
    }

    void Execute() override
    {
        using namespace std;
        try
        {
            result = executeFunc();
        }
        FIRE_CATCH
    }

protected:
    void HandleOKCallback() override
    {
        using namespace v8;
        NanScope();
        auto convertedResult = resultConvFunc(result);
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
        return [=](T result)
        {
            try
            {
                return resultConvFunc(result);
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
        catch(exception& ex)
        {
            SetErrorMessage(ex.what());
        }
        catch(...)
        {
            SetErrorMessage("Fatal error!");
        }
    }

private:
    ExecuteFunc executeFunc;
};

#endif
