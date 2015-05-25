#include "ext.h"
#include "worker.h"

using namespace v8;
using namespace std;

Worker* Worker::instance = nullptr;

Worker* Worker::getInstance()
{
    if (!instance) instance = new Worker();
    return instance;
}

Worker::Worker() :
    mainLoop(uv_default_loop())
{
}

void Worker::queue(const Worker::WorkFunc &work, const Worker::CallbackFunc &callback)
{
    auto workData = new uv_work_t;
    workData->data = new WorkDataT(work, callback, "");
    uv_queue_work(this->mainLoop, workData, doWorkItem, workItemFinished);
}

void Worker::doWorkItem(uv_work_t *workData)
{
    auto& wd = *((WorkDataT*)workData->data);
    try
    {
        get<0>(wd)();
    }
    catch(exception& ex)
    {
        get<2>(wd) = ex.what();
    }
}

void Worker::workItemFinished(uv_work_t *workData, int status)
{
    auto& wd = *((WorkDataT*)workData->data);
    get<1>(wd)(get<2>(wd));
}
