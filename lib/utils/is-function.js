"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isFunction;

function isFunction(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
}

;