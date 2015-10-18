"use strict";
var Bluebird = require("bluebird");
var _ = require("lodash");
var async = Bluebird.coroutine;
var retryCount = 5;
var gcTime = 1000;
function isOutOfMemoryError(e) {
  return e.message.indexOf("998") > 0;
}
function invokeGC(af) {
  af.gc(gcTime);
}
function synchronify(af, f) {
  return function() {
    var err;
    var res;
    var done;
    var cb = function(e, r) {
      err = e;
      res = r;
      done = true;
    };
    var args = _.toArray(arguments).concat(cb);
    for (var i = 0; i < retryCount; i++) {
      done = false;
      f.apply(this, args);
      while (!done)
        af._doEvents();
      if (err) {
        if (!isOutOfMemoryError(err)) {
          throw err;
        } else {
          invokeGC(af);
        }
      }
    }
    if (err)
      throw err;
    return res;
  };
}
function installAsyncAndSync(af, obj, name) {
  if (_.isUndefined(name)) {
    var $__4 = true;
    var $__5 = false;
    var $__6 = undefined;
    try {
      for (var $__2 = void 0,
          $__1 = (_.keys(obj))[Symbol.iterator](); !($__4 = ($__2 = $__1.next()).done); $__4 = true) {
        var key = $__2.value;
        {
          installAsyncAndSync(af, obj, key);
        }
      }
    } catch ($__7) {
      $__5 = true;
      $__6 = $__7;
    } finally {
      try {
        if (!$__4 && $__1.return != null) {
          $__1.return();
        }
      } finally {
        if ($__5) {
          throw $__6;
        }
      }
    }
    return;
  }
  if (name !== "AFArray") {
    var f = obj[name];
    if (_.isFunction(f)) {
      if (!_.isFunction(obj[name + "Async"])) {
        obj[name + "Async"] = async($traceurRuntime.initGeneratorFunction(function $__8() {
          var self,
              args,
              call,
              err,
              i,
              $__9,
              $__10,
              e;
          var $arguments = arguments;
          return $traceurRuntime.createGeneratorInstance(function($ctx) {
            while (true)
              switch ($ctx.state) {
                case 0:
                  self = this;
                  args = _.toArray($arguments);
                  call = function() {
                    return new Bluebird(function(resolve, reject) {
                      var cb = function(e, r) {
                        if (e) {
                          reject(e);
                        } else {
                          resolve(r);
                        }
                      };
                      args.push(cb);
                      f.apply(self, args);
                    });
                  };
                  err = null;
                  $ctx.state = 22;
                  break;
                case 22:
                  i = 0;
                  $ctx.state = 20;
                  break;
                case 20:
                  $ctx.state = (i < retryCount) ? 11 : 18;
                  break;
                case 14:
                  i++;
                  $ctx.state = 20;
                  break;
                case 11:
                  $ctx.pushTry(9, null);
                  $ctx.state = 12;
                  break;
                case 12:
                  $__9 = call();
                  $ctx.state = 6;
                  break;
                case 6:
                  $ctx.state = 2;
                  return $__9;
                case 2:
                  $__10 = $ctx.sent;
                  $ctx.state = 4;
                  break;
                case 4:
                  $ctx.returnValue = $__10;
                  $ctx.state = -2;
                  break;
                case 8:
                  $ctx.popTry();
                  $ctx.state = 14;
                  break;
                case 9:
                  $ctx.popTry();
                  $ctx.maybeUncatchable();
                  e = $ctx.storedException;
                  $ctx.state = 15;
                  break;
                case 15:
                  if (!isOutOfMemoryError(e)) {
                    throw e;
                  }
                  invokeGC(af);
                  err = e;
                  $ctx.state = 14;
                  break;
                case 18:
                  throw err;
                  $ctx.state = -2;
                  break;
                default:
                  return $ctx.end();
              }
          }, $__8, this);
        }));
      }
      if (!_.isFunction(obj[name + "Sync"])) {
        obj[name + "Sync"] = synchronify(af, f);
      }
      obj[name] = function() {
        var err = null;
        for (var i = 0; i < retryCount; i++) {
          try {
            return f.apply(this, arguments);
          } catch (e) {
            if (!isOutOfMemoryError(e)) {
              throw e;
            }
            invokeGC(af);
            err = e;
          }
        }
        throw err;
      };
    }
  }
}
function ext(af) {
  installAsyncAndSync(af, af);
  installAsyncAndSync(af, af.AFArray);
  installAsyncAndSync(af, af.AFArray.prototype);
  _.extend(af, {
    end: -1,
    span: null,
    all: -1,
    dtype: require("./dtype"),
    dType: require("./dtype"),
    source: require("./source"),
    matchType: require("./matchType"),
    cSpace: require("./cSpace"),
    CSpace: require("./cSpace"),
    connectivity: require("./connectivity"),
    borderType: require("./borderType"),
    interpType: require("./interpType"),
    matProp: require("./matProp"),
    normType: require("./normType"),
    convMode: require("./convMode"),
    convDomain: require("./convDomain"),
    Dim4: require("./dim4"),
    Seq: require("./seq"),
    Complex: require("./complex"),
    Row: require("./row"),
    Col: require("./col"),
    Rows: require("./rows"),
    Cols: require("./cols"),
    getDevices: function() {
      var current = this.getDevice();
      try {
        var count = this.getDeviceCount();
        var result = [];
        for (var i = 0; i < count; i++) {
          this.setDevice(i);
          var info = this.deviceInfo();
          info.id = i;
          result.push(info);
        }
        return result;
      } finally {
        this.setDevice(current);
      }
    },
    gfor: require("./makeGfor")(af)
  });
}
module.exports = ext;

//# sourceMappingURL=ext.js.map
