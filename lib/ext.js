"use strict";

function Ext(self) {
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
}

module.exports = Ext;