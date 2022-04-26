"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = logNotFound;

var _logger = _interopRequireDefault(require("./logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isArray(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
}

function logNotFound(component) {
  var errInfo = '';

  if (component.id) {
    if (isArray(component.id)) {
      errInfo = "for ids ".concat(component.id.join(', '), ".");
    } else {
      errInfo = "for id ".concat(component.id, ".");
    }
  } else if (component.handle) {
    errInfo = "for handle \"".concat(component.handle, "\".");
  }

  var message = "Not Found: ".concat(component.typeKey, " not found ").concat(errInfo);

  _logger.default.warn(message);
}