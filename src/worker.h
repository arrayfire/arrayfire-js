#ifndef ARRAY_FIRE_JS_WORKER_H
#define ARRAY_FIRE_JS_WORKER_H

#include <functional>
#include <nan.h>
#include <tuple>
#include <string>

struct Worker
{
    typedef std::function<void()> WorkFunc;
    typedef std::function<void(const std::string&)> CallbackFunc;
    typedef std::tuple<WorkFunc, CallbackFunc, std::string> WorkDataT;

    Worker();
    static Worker* getInstance();
    void queue(const WorkFunc& work, const CallbackFunc& callback);
private:
    uv_loop_t* mainLoop;
    static Worker* instance;
    static void doWorkItem(uv_work_t* workData);
    static void workItemFinished(uv_work_t* workData, int status);
};

#endif
