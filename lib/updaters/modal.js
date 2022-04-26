"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _updater = _interopRequireDefault(require("../updater"));

var _product = _interopRequireDefault(require("../components/product"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var ModalUpdater =
/*#__PURE__*/
function (_Updater) {
  _inheritsLoose(ModalUpdater, _Updater);

  function ModalUpdater() {
    return _Updater.apply(this, arguments) || this;
  }

  var _proto = ModalUpdater.prototype;

  _proto.updateConfig = function updateConfig(config) {
    var _this = this;

    _Updater.prototype.updateConfig.call(this, config);

    this.component.product = new _product.default(this.component.productConfig, this.component.props);
    return this.component.product.init(this.component.model).then(function () {
      return _this.component.view.resize();
    });
  };

  return ModalUpdater;
}(_updater.default);

exports.default = ModalUpdater;