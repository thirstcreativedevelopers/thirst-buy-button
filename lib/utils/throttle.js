"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _frameUtils = _interopRequireDefault(require("./frame-utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function CustomEvent(event, params) {
  params = params || {
    bubbles: false,
    cancelable: false,
    detail: undefined
  };
  var evt = document.createEvent('CustomEvent');
  evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
  return evt;
}

;
CustomEvent.prototype = window.Event.prototype;

var throttle = function throttle(type, name, obj) {
  obj = obj || window;
  var running = false;

  var func = function func() {
    if (running) {
      return;
    }

    running = true;

    _frameUtils.default.requestAnimationFrame.call(window, function () {
      obj.dispatchEvent(new CustomEvent(name));
      running = false;
    });
  };

  obj.addEventListener(type, func);
};

var _default = throttle;
exports.default = _default;