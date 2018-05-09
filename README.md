Convert Units
=========

The web service has a single endpoint with a single method, **Convert Units**, which will convert any properly formatted unit string to their SI counterparts. 

## Installation

```shell
  git clone git@github.com:Setogit/cityline.git
```

## Start the Service

```shell
  cd cityline
  npm start
```

## Test the Service

```shell
  cd cityline
  npm test
```

## REST API

```js
METHOD: GET
PATH: /units/si
PARAMS: units - A unit string †

RETURNS: conversion - A conversion object ††
```

† A valid unit string is a string containing any number of units multiplied or divided, potentially containing parentheses. Valid examples include <code>degree , degree/minute , (degree/(minute*hectare)) , ha*°</code>.

†† A valid conversion object is a JSON object containing two fields: <code>unit_name</code> and <code>multiplication_factor</code> . <code>unit_name</code> is the unit string from the request, with all units converted to to their SI counterpart. Reducing units is not necessary,
so s/s is perfectly valid output. The parentheses should match the request unit string. <code>multiplication_factor</code> is a floating point number (with 14 significant digits) that you can use to convert any input in the original units to the new SI units.

### Example Request:
```js
GET /units/si?units=(degree/minute)
```

**Returns**:
```js
{
    "unit_name": "(rad/s)",
    "multiplication_factor": 0.0002908882086657216
}
```

## Unit Conversion Factors

This table denotes valid input and conversion factors for you to implement. Either values from the left two columns are valid input, as are SI units themselves.

| Name | Symbol | Quantity | SI Conversion |
| --- | --- | --- | --- |
| minute | min | time | 60s |
| hour | h | time | 3600s |
| day | d | time | 86400s |
| degree | ° | unitless/plane angle | (π/180) rad |
| arcminute | ' | unitless/plane angle | (π/10800) rad |
| arcsecond | " | unitless/plane angle | (π/648000) rad |
| hectare | ha | area | 10000 m2 |
| litre | L | volume | 0.001 m3 |
| tonne | t | mass | 1000 kg |

## Known Limitations

* 1.0.0 Initial release  setogit@gmail.com
    ** '°', "'", '"' are not supported because mathjs is used for format validation.  At the moment, the value of mathjs parser exceeds this feature value.
    ** Parens are practically ignored.
    ** Supported formats are: <A>, <A>*<B> and <A>/<B> with parens.  For example, (degree/(minute*hectare)) is not supported.

## Revision History

* 1.0.0 Initial release  setogit@gmail.com
