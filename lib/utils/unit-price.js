"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function getUnitString(unitEnum) {
  if (unitEnum === 'L') {
    return 'L';
  } else if (unitEnum === 'M3') {
    return 'm³';
  } else if (unitEnum === 'M2') {
    return 'm²';
  } else {
    return unitEnum.toLowerCase();
  }
}

function getUnitPriceBaseUnit(referenceValue, referenceUnit) {
  var unitString = getUnitString(referenceUnit);

  if (referenceValue === 1) {
    return "".concat(unitString);
  }

  return "".concat(referenceValue).concat(unitString);
}

var _default = getUnitPriceBaseUnit;
exports.default = _default;