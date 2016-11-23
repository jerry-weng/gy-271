'use strict';

var driver = require('ruff-driver');

var Resolution = [
    0.73,
    0.92,
    1.22,
    1.52,
    2.27,
    2.56,
    3.03,
    4.35
];

var Addr = {
    cra: 0,
    crb: 1,
    mr: 2,
    data: 3,
    sr: 9,
    ir: 10
};

module.exports = driver({
    attach: function (inputs, context, next) {
        this._i2c = inputs['i2c'];

        this._resolution = Resolution[1];
        this._setOperationMode(next);
    },
    exports: {
        _setOperationMode: function (callback) {
            this._i2c.writeByte(Addr.cra, 0x70);
            this._i2c.writeByte(Addr.mr, 0x00, callback);
        },
        getHeading: function (callback) {
            this.getMagneticField(function (error, value) {
                if (error) {
                    callback(error);
                    return;
                }
                var radian = Math.atan2(value[1], value[0]);
                if (radian < 0) {
                    radian += 2 * Math.PI;
                }
                callback(undefined, (radian * 180 / Math.PI).toFixed(2) - 0);
            });
        },
        getMagneticField: function (callback) {
            var that = this;
            this._i2c.readBytes(Addr.data, 6, function (error, value) {
                callback(error, [
                    wordToNum(value.slice(0, 2)),
                    wordToNum(value.slice(4)),
                    wordToNum(value.slice(2, 4))
                ].map(function (value) {
                    return value * that._resolution;
                }));
            });
        },
        getIdentification: function (callback) {
            this._i2c.readBytes(Addr.ir, 3, function (error, value) {
                if (error) {
                    callback(error);
                    return;
                }
                callback(undefined, String.fromCharCode.apply(undefined, value));
            });
        }
    }
});

function wordToNum(word) {
    var num = word[0] << 8 | word[1];
    if (word[0] >= 0x80) {
        return num - Math.pow(2, 16);
    }
    return num;
}
