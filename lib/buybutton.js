"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _shopifyBuy = _interopRequireDefault(require("shopify-buy"));

var _ui = _interopRequireDefault(require("./ui"));

var _product = _interopRequireDefault(require("./templates/product"));

require("whatwg-fetch");

require("core-js/features/promise");

require("core-js/features/string/ends-with");

require("core-js/features/array/iterator");

require("core-js/features/array/find");

require("core-js/features/object/assign");

require("core-js/features/object/values");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var UpdatedShopifyBuy =
/*#__PURE__*/
function (_ShopifyBuy) {
  _inheritsLoose(UpdatedShopifyBuy, _ShopifyBuy);

  function UpdatedShopifyBuy() {
    return _ShopifyBuy.apply(this, arguments) || this;
  }

  UpdatedShopifyBuy.buildClient = function buildClient(config) {
    var newConfig = Object.assign({}, config, {
      source: 'buy-button-js'
    });
    return _ShopifyBuy.buildClient.call(this, newConfig);
  };

  return UpdatedShopifyBuy;
}(_shopifyBuy.default);

window.ShopifyBuy = window.ShopifyBuy || UpdatedShopifyBuy;
UpdatedShopifyBuy.UI = window.ShopifyBuy.UI || {
  domains: {},
  init: function init(client) {
    var integrations = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var styleOverrides = arguments.length > 2 ? arguments[2] : undefined;
    var uniqueClientKey = "".concat(client.config.domain, ".").concat(client.config.storefrontAccessToken);

    if (!this.domains[uniqueClientKey]) {
      this.domains[uniqueClientKey] = new _ui.default(client, integrations, styleOverrides);
    }

    return this.domains[uniqueClientKey];
  },
  adapterHelpers: {
    templates: {
      product: _product.default
    }
  }
};
var _default = UpdatedShopifyBuy;
exports.default = _default;