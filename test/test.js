'use strict';

var mock = require('ruff-mock');
var assert = require('assert');

var when = mock.when;

var Device = require('../');

require('t');

describe('Template Driver', function () {
    var device;
    var i2c;

    before(function () {
        i2c = mock({}, true);
        device = new Device({
            i2c: i2c
        });
    });

    it('should get expected magnetic field when invoke `getMagneticField`', function (done) {
        var sensorValue = [0, 1, 0, 2, 0xFF, 3];
        var expectedMagneticField = [1 * 0.92, -253 * 0.92, 2 * 0.92];

        when(i2c)
            .readBytes(3, 6, Function)
            .then(function (cmd, num, callback) {
                setImmediate(function () {
                    callback(undefined, sensorValue);
                });
            });

        device.getMagneticField(function (error, value) {
            if (error) {
                done(error);
                return;
            }
            assert.deepEqual(value, expectedMagneticField);
            done();
        });
    });

    it('should get expected heading when invoke `getHeading`', function (done) {
        var sensorValue = [0, 1, 0xFF, 3, 0, 1];
        var expectedHeading = 45;

        when(i2c)
            .readBytes(3, 6, Function)
            .then(function (cmd, num, callback) {
                setImmediate(function () {
                    callback(undefined, sensorValue);
                });
            });

        device.getHeading(function (error, value) {
            if (error) {
                done(error);
                return;
            }
            assert.equal(value, expectedHeading);
            done();
        });
    });

    it('should get expected identification when invoke `getIdentification`', function (done) {
        var sensorVlaue = [72, 52, 51];
        var expectedId = 'H43';

        when(i2c)
            .readBytes(10, 3, Function)
            .then(function (cmd, num, callback) {
                setImmediate(function () {
                    callback(undefined, sensorVlaue);
                });
            });

        device.getIdentification(function (error, value) {
            if (error) {
                done(error);
                return;
            }
            assert.deepEqual(value, expectedId);
            done();
        });
    });
});
