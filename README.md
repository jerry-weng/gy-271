[![Build Status](https://travis-ci.org/jerry-weng/gy-271.svg)](https://travis-ci.org/jerry-weng/gy-271)

# GY-271 Driver

3-axis digital compass sensor driver.

## Device Model

- [gy-271](https://rap.ruff.io/devices/gy-271)

## Install

```sh
> rap device add --model gy-271 --id <device-id>
```

## Usage

```js
$('#<device-id>').getHeading(function (error, value) {
    if (error) {
        console.log(error);
        return;
    }
    console.log(value);
});
```

## API References

### Methods

#### `getHeading(callback)`

Get the heading of the sensor with respect to the X axis.

- **callback:** The callback that takes the first argument as the possible error and the second argument as the heading value in degree.
The range of the heading is [0, 360).

#### `getMagneticField(callback)`

Get the magnetic field measurement by the sensor.

- **callback:** The callback that takes the first argument as the possible error and the second argument as the magnetic vlaue.
The magnetic value is an array composed with 3 elements that represent x, y and z axis data respectively.

#### `getIdentification(callback)`

Get the identification of the chip `HMC5883L`, which is fixed with `H43`.

## Supported OS

Test passed on Ruff v1.6.1

## Note

Make sure the sensor is parallel to the ground, thus the heading from `getHeading()` is a significant value.
