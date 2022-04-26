"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _updater = _interopRequireDefault(require("../updater"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var ProductSetUpdater =
/*#__PURE__*/
function (_Updater) {
  _inheritsLoose(ProductSetUpdater, _Updater);

  function ProductSetUpdater() {
    return _Updater.apply(this, arguments) || this;
  }

  var _proto = ProductSetUpdater.prototype;

  _proto.updateConfig = function updateConfig(config) {
    _Updater.prototype.updateConfig.call(this, config);

    this.component.products[0].updateConfig({
      options: Object.assign({}, config.options)
    });
    this.component.cart.updateConfig(config);
    this.component.renderProducts();
  };

  return ProductSetUpdater;
}(_updater.default);

exports.default = ProductSetUpdater;