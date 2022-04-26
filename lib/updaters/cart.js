"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _updater = _interopRequireDefault(require("../updater"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var CartUpdater =
/*#__PURE__*/
function (_Updater) {
  _inheritsLoose(CartUpdater, _Updater);

  function CartUpdater() {
    return _Updater.apply(this, arguments) || this;
  }

  var _proto = CartUpdater.prototype;

  _proto.updateConfig = function updateConfig(config) {
    _Updater.prototype.updateConfig.call(this, config);

    this.component.toggles.forEach(function (toggle) {
      return toggle.updateConfig(config);
    });
  };

  return CartUpdater;
}(_updater.default);

exports.default = CartUpdater;