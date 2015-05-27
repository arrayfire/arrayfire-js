"use strict";

function Ext(self) {
    self.dtype = {
        f32: 0,
        c32: 1,
        f64: 2,
        c64: 3,
        b8: 4,
        s32: 5,
        u32: 6,
        u8: 7,
        s64: 8,
        u64: 9
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
}

module.exports = Ext;