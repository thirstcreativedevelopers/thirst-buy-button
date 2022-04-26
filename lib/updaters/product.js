"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _updater = _interopRequireDefault(require("../updater"));

var _normalizeConfig = _interopRequireDefault(require("../utils/normalize-config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var MAX_WIDTH = '950px';

var ProductUpdater =
/*#__PURE__*/
function (_Updater) {
  _inheritsLoose(ProductUpdater, _Updater);

  function ProductUpdater() {
    return _Updater.apply(this, arguments) || this;
  }

  var _proto = ProductUpdater.prototype;

  _proto.updateConfig = function updateConfig(config) {
    var _this = this;

    var newConfig = (0, _normalizeConfig.default)(config);

    if (newConfig.storefrontId || newConfig.storefrontVariantId) {
      this.component.storefrontId = newConfig.storefrontId || this.component.storefrontId;
      this.component.defaultStorefrontVariantId = newConfig.storefrontVariantId || this.component.defaultStorefrontVariantId;
      this.component.init();
      return;
    }

    var layout = this.component.options.layout;

    if (config.options && config.options.product) {
      if (config.options.product.layout) {
        layout = config.options.product.layout;
      }

      if (this.component.view.iframe) {
        if (layout === 'vertical' && this.component.view.iframe.width === MAX_WIDTH) {
          this.component.view.iframe.setWidth(this.component.options.width);
        }

        if (layout === 'horizontal' && this.component.view.iframe.width && this.component.view.iframe.width !== MAX_WIDTH) {
          this.component.view.iframe.setWidth(MAX_WIDTH);
        }

        if (config.options.product.width && layout === 'vertical') {
          this.component.view.iframe.setWidth(config.options.product.width);
        }

        if (config.options.product.layout) {
          this.component.view.iframe.el.style.width = '100%';
        }
      }
    }

    if (this.component.view.iframe) {
      this.component.view.iframe.removeClass(this.component.classes.product.vertical);
      this.component.view.iframe.removeClass(this.component.classes.product.horizontal);
      this.component.view.iframe.addClass(this.component.classes.product[layout]);
      this.component.view.resize();
    }

    _toConsumableArray(this.component.view.wrapper.querySelectorAll('img')).forEach(function (img) {
      img.addEventListener('load', function () {
        _this.component.view.resize();
      });
    });

    _Updater.prototype.updateConfig.call(this, config);

    if (this.component.cart) {
      this.component.cart.updateConfig(config);
    }

    if (this.component.modal) {
      this.component.modal.updateConfig(Object.assign({}, config, {
        options: Object.assign({}, this.component.config, {
          product: this.component.modalProductConfig
        })
      }));
    }
  };

  return ProductUpdater;
}(_updater.default);

exports.default = ProductUpdater;