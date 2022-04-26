"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _merge = _interopRequireDefault(require("../utils/merge"));

var _component = _interopRequireDefault(require("../component"));

var _toggle = _interopRequireDefault(require("../views/toggle"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var CartToggle =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(CartToggle, _Component);

  function CartToggle(config, props) {
    var _this;

    _this = _Component.call(this, config, props) || this;
    _this.typeKey = 'toggle';
    _this.node = config.node || _this.props.cart.node.parentNode.insertBefore(document.createElement('div'), _this.props.cart.node);
    _this.view = new _toggle.default(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = CartToggle.prototype;

  _proto.toggleCart = function toggleCart(evt) {
    evt.stopPropagation();
    this.props.setActiveEl(this.view.node);
    this.props.cart.toggleVisibility();
  };

  _createClass(CartToggle, [{
    key: "count",
    get: function get() {
      if (!this.props.cart.model) {
        return 0;
      }

      return this.props.cart.model.lineItems.reduce(function (acc, lineItem) {
        return acc + lineItem.quantity;
      }, 0);
    }
  }, {
    key: "viewData",
    get: function get() {
      return Object.assign({}, this.options.viewData, {
        classes: this.classes,
        text: this.options.text,
        count: this.count
      });
    }
  }, {
    key: "DOMEvents",
    get: function get() {
      return (0, _merge.default)({}, {
        click: this.toggleCart.bind(this)
      }, this.options.DOMEvents);
    }
  }]);

  return CartToggle;
}(_component.default);

exports.default = CartToggle;