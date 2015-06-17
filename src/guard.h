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

#ifndef FIRE_JS_GUARD_H
#define FIRE_JS_GUARD_H

#include <atomic>

/* The role of this class is not to serve as a syntactic sugar for a mutex.
 * There should be no held mutexes in the application, because if a long running operation
 * holds a mutex in the background, and another lockable operation gets invoked in the main loop,
 * then it will hold the loop until the asynchronous operation gets completed. We will loose asynchronity.
 *
 * But there should be no ArrayFire operations run in parallel, because those are not thread safe.
 * It's the applications responsibility to provide sequentiality. This Guard class is there to enforce this rule.
 * If the application executes an ArrayFire operation while there are an already running asynchronous operation in progress,
 * an exception will be thrown.
 */
struct Guard
{
    Guard();
    Guard(const Guard&) = delete;
    Guard(Guard&&) = delete;
    ~Guard();
private:
    static std::atomic<int> _inc;
};

#endif // FIRE_JS_GUARD_H
