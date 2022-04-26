"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _view = _interopRequireDefault(require("../view"));

var _elementClass = require("../utils/element-class");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var CartView =
/*#__PURE__*/
function (_View) {
  _inheritsLoose(CartView, _View);

  function CartView(component) {
    var _this;

    _this = _View.call(this, component) || this;
    _this.node.className = 'shopify-buy-cart-wrapper';
    return _this;
  }

  var _proto = CartView.prototype;

  _proto.render = function render() {
    _View.prototype.render.call(this);

    if (this.component.isVisible) {
      this.addClass('is-active');
      this.addClass('is-visible');
      this.addClass('is-initialized');

      if (this.iframe) {
        (0, _elementClass.addClassToElement)('is-block', this.iframe.el);
      }
    } else {
      this.removeClass('is-active');

      if (!this.component.props.browserFeatures.transition) {
        this.removeClass('is-visible');

        if (this.iframe) {
          (0, _elementClass.removeClassFromElement)('is-block', this.iframe.el);
        }
      }
    }
  };

  _proto.delegateEvents = function delegateEvents() {
    var _this2 = this;

    _View.prototype.delegateEvents.call(this);

    if (this.component.props.browserFeatures.transition) {
      this.node.addEventListener('transitionend', function () {
        if (_this2.component.isVisible) {
          return;
        }

        _this2.removeClass('is-visible');

        if (_this2.iframe) {
          (0, _elementClass.removeClassFromElement)('is-block', _this2.iframe.el);
        }
      });
    }
  };

  _proto.wrapTemplate = function wrapTemplate(html) {
    return "<div class=\"".concat(this.component.classes.cart.cart, "\">").concat(html, "</div>");
  };

  _createClass(CartView, [{
    key: "wrapperClass",
    get: function get() {
      return this.component.isVisible ? 'is-active' : '';
    }
  }]);

  return CartView;
}(_view.default);

exports.default = CartView;