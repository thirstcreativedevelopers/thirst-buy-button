"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function merge(target) {
  for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sources[_key - 1] = arguments[_key];
  }

  sources.forEach(function (source) {
    if (source) {
      Object.keys(source).forEach(function (key) {
        if (Object.prototype.toString.call(source[key]) === '[object Object]') {
          target[key] = merge(target[key] || {}, source[key]);
        } else {
          target[key] = source[key];
        }
      });
    }
  });
  return target;
}

var _default = merge;
exports.default = _default;