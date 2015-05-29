"use strict";

let Bluebird = require("bluebird");

function Ext(self) {
    self.types = {
        dtype: require("./dtype"),
        source: require("./source")
    };

    self.getDevices = function() {
        let current = self.getDevice();
        try {
            let count = self.getDeviceCount();
            let result = [];
            for (let i = 0; i < count; i++) {
                self.setDevice(i);
                result.push(self.getDeviceInfo());
            }
            return result;
        }
        finally {
            self.setDevice(current);
        }
    };

    self.async = Bluebird.coroutine;
}

module.exports = Ext;