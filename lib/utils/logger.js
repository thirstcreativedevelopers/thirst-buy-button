"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function wrapConsole(logCommand) {
  var logMethod = function logMethod() {
    var hostConsole = window.console;
    var args = Array.prototype.slice.apply(arguments).join(' ');
    /* eslint-disable no-console */

    if (hostConsole) {
      hostConsole[logCommand](args);
    }
    /* eslint-enable no-console */

  };

  return function () {
    var args = Array.prototype.slice.call(arguments);
    args.unshift('[SHOPIFY-BUY-UI]: ');
    logMethod.apply(void 0, _toConsumableArray(args));
  };
}

var logger = {
  debug: wrapConsole('debug'),
  info: wrapConsole('info'),
  warn: wrapConsole('warn'),
  error: wrapConsole('error'),
  log: wrapConsole('log')
};
var _default = logger;
exports.default = _default;