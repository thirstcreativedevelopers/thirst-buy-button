"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CheckoutNavigator =
/*#__PURE__*/
function () {
  function CheckoutNavigator(config) {
    this.config = config;
  }

  var _proto = CheckoutNavigator.prototype;

  _proto.open = function open(url) {
    if (this.config.cart.popup) {
      window.open(url, 'checkout', this.params);
    } else {
      window.location = url;
    }
  };

  _createClass(CheckoutNavigator, [{
    key: "params",
    get: function get() {
      var config = Object.assign({}, this.config.window, {
        left: window.outerWidth / 2 - 200,
        top: window.outerHeight / 2 - 300
      });
      return Object.keys(config).reduce(function (acc, key) {
        return "".concat(acc).concat(key, "=").concat(config[key], ",");
      }, '');
    }
  }]);

  return CheckoutNavigator;
}();

exports.default = CheckoutNavigator;