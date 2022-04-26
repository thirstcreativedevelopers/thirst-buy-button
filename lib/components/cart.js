"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.NO_IMG_URL = void 0;

var _merge2 = _interopRequireDefault(require("../utils/merge"));

var _component = _interopRequireDefault(require("../component"));

var _toggle = _interopRequireDefault(require("./toggle"));

var _template = _interopRequireDefault(require("../template"));

var _checkout = _interopRequireDefault(require("./checkout"));

var _money = _interopRequireDefault(require("../utils/money"));

var _cart = _interopRequireDefault(require("../views/cart"));

var _cart2 = _interopRequireDefault(require("../updaters/cart"));

var _elementClass = require("../utils/element-class");

var _focus = require("../utils/focus");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var NO_IMG_URL = '//sdks.shopifycdn.com/buy-button/latest/no-image.jpg';
exports.NO_IMG_URL = NO_IMG_URL;
var LINE_ITEM_TARGET_SELECTIONS = ['ENTITLED', 'EXPLICIT'];
var CART_TARGET_SELECTION = 'ALL';
/**
 * Renders and cart embed.
 * @extends Component.
 */

var Cart =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(Cart, _Component);

  /**
   * create Cart.
   * @param {Object} config - configuration object.
   * @param {Object} props - data and utilities passed down from UI instance.
   */
  function Cart(config, props) {
    var _this;

    _this = _Component.call(this, config, props) || this;
    _this.addVariantToCart = _this.addVariantToCart.bind(_assertThisInitialized(_this));
    _this.childTemplate = new _template.default(_this.config.lineItem.templates, _this.config.lineItem.contents, _this.config.lineItem.order);
    _this.node = config.node || document.body.appendChild(document.createElement('div'));
    _this.isVisible = _this.options.startOpen;
    _this.lineItemCache = [];
    _this.moneyFormat = _this.globalConfig.moneyFormat;
    _this.checkout = new _checkout.default(_this.config);
    var toggles = _this.globalConfig.toggles || [{
      node: _this.node.parentNode.insertBefore(document.createElement('div'), _this.node)
    }];
    _this.toggles = toggles.map(function (toggle) {
      return new _toggle.default((0, _merge2.default)({}, config, toggle), Object.assign({}, _this.props, {
        cart: _assertThisInitialized(_this)
      }));
    });
    _this.updater = new _cart2.default(_assertThisInitialized(_this));
    _this.view = new _cart.default(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = Cart.prototype;

  _proto.createToggles = function createToggles(config) {
    var _this2 = this;

    this.toggles = this.toggles.concat(config.toggles.map(function (toggle) {
      return new _toggle.default((0, _merge2.default)({}, config, toggle), Object.assign({}, _this2.props, {
        cart: _this2
      }));
    }));
    return Promise.all(this.toggles.map(function (toggle) {
      return toggle.init({
        lineItems: _this2.lineItems
      });
    }));
  }
  /**
   * get key for configuration object.
   * @return {String}
   */
  ;

  _proto.imageForLineItem = function imageForLineItem(lineItem) {
    var imageSize = 180;
    var imageOptions = {
      maxWidth: imageSize,
      maxHeight: imageSize
    };

    if (lineItem.variant.image) {
      return this.props.client.image.helpers.imageForSize(lineItem.variant.image, imageOptions);
    } else {
      return NO_IMG_URL;
    }
  }
  /**
   * sets model to null and removes checkout from localStorage
   * @return {Promise} promise resolving to the cart model
   */
  ;

  _proto.removeCheckout = function removeCheckout() {
    this.model = null;
    localStorage.removeItem(this.localStorageCheckoutKey);
    return this.model;
  }
  /**
   * get model data either by calling client.createCart or loading from localStorage.
   * @return {Promise} promise resolving to cart instance.
   */
  ;

  _proto.fetchData = function fetchData() {
    var _this3 = this;

    var checkoutId = localStorage.getItem(this.localStorageCheckoutKey);

    if (checkoutId) {
      return this.props.client.checkout.fetch(checkoutId).then(function (checkout) {
        _this3.model = checkout;

        if (checkout.completedAt) {
          return _this3.removeCheckout();
        }

        return _this3.sanitizeCheckout(checkout).then(function (newCheckout) {
          _this3.updateCache(newCheckout.lineItems);

          return newCheckout;
        });
      }).catch(function () {
        return _this3.removeCheckout();
      });
    } else {
      return Promise.resolve(null);
    }
  };

  _proto.sanitizeCheckout = function sanitizeCheckout(checkout) {
    var lineItemsToDelete = checkout.lineItems.filter(function (item) {
      return !item.variant;
    });

    if (!lineItemsToDelete.length) {
      return Promise.resolve(checkout);
    }

    var lineItemIds = lineItemsToDelete.map(function (item) {
      return item.id;
    });
    return this.props.client.checkout.removeLineItems(checkout.id, lineItemIds).then(function (newCheckout) {
      return newCheckout;
    });
  };

  _proto.fetchMoneyFormat = function fetchMoneyFormat() {
    return this.props.client.shop.fetchInfo().then(function (res) {
      return res.moneyFormat;
    });
  }
  /**
   * initializes component by creating model and rendering view.
   * Creates and initalizes toggle component.
   * @param {Object} [data] - data to initialize model with.
   * @return {Promise} promise resolving to instance.
   */
  ;

  _proto.init = function init(data) {
    var _this4 = this;

    if (!this.moneyFormat) {
      this.fetchMoneyFormat().then(function (moneyFormat) {
        _this4.moneyFormat = moneyFormat;
      });
    }

    return _Component.prototype.init.call(this, data).then(function (cart) {
      return _this4.toggles.map(function (toggle) {
        var lineItems = cart.model ? cart.model.lineItems : [];
        return toggle.init({
          lineItems: lineItems
        });
      });
    }).then(function () {
      return _this4;
    });
  };

  _proto.destroy = function destroy() {
    _Component.prototype.destroy.call(this);

    this.toggles.forEach(function (toggle) {
      return toggle.destroy();
    });
  }
  /**
   * closes cart
   */
  ;

  _proto.close = function close() {
    this.isVisible = false;
    this.view.render();
    (0, _focus.removeTrapFocus)(this.view.wrapper);
  }
  /**
   * opens cart
   */
  ;

  _proto.open = function open() {
    this.isVisible = true;
    this.view.render();
    this.setFocus();
  }
  /**
   * toggles cart visibility
   * @param {Boolean} visible - desired state.
   */
  ;

  _proto.toggleVisibility = function toggleVisibility(visible) {
    this.isVisible = visible || !this.isVisible;
    this.view.render();

    if (this.isVisible) {
      this.setFocus();
    }
  };

  _proto.onQuantityBlur = function onQuantityBlur(evt, target) {
    this.setQuantity(target, function () {
      return parseInt(target.value, 10);
    });
  };

  _proto.onQuantityIncrement = function onQuantityIncrement(qty, evt, target) {
    this.setQuantity(target, function (prevQty) {
      return prevQty + qty;
    });
  };

  _proto.onCheckout = function onCheckout() {
    this._userEvent('openCheckout');

    this.props.tracker.track('Open cart checkout', {});
    this.checkout.open(this.model.webUrl);
  }
  /**
   * set quantity for a line item.
   * @param {Object} target - DOM node of line item
   * @param {Function} fn - function to return new quantity given currrent quantity.
   */
  ;

  _proto.setQuantity = function setQuantity(target, fn) {
    var id = target.getAttribute('data-line-item-id');
    var item = this.model.lineItems.find(function (lineItem) {
      return lineItem.id === id;
    });
    var newQty = fn(item.quantity);
    return this.props.tracker.trackMethod(this.updateItem.bind(this), 'Update Cart', this.cartItemTrackingInfo(item, newQty))(id, newQty);
  };

  _proto.setNote = function setNote(evt) {
    var _this5 = this;

    var note = evt.target.value;
    return this.props.client.checkout.updateAttributes(this.model.id, {
      note: note
    }).then(function (checkout) {
      _this5.model = checkout;
      return checkout;
    });
  }
  /**
   * set cache using line items.
   * @param {Array} lineItems - array of GraphModel line item objects.
   */
  ;

  _proto.updateCache = function updateCache(lineItems) {
    var cachedLineItems = this.lineItemCache.reduce(function (acc, item) {
      acc[item.id] = item;
      return acc;
    }, {});
    this.lineItemCache = lineItems.map(function (item) {
      return Object.assign({}, cachedLineItems[item.id], item);
    });
    return this.lineItemCache;
  }
  /**
   * update cached line item.
   * @param {Number} id - lineItem id.
   * @param {Number} qty - quantity for line item.
   */
  ;

  _proto.updateCacheItem = function updateCacheItem(lineItemId, quantity) {
    if (this.lineItemCache.length === 0) {
      return;
    }

    var lineItem = this.lineItemCache.find(function (item) {
      return lineItemId === item.id;
    });
    lineItem.quantity = quantity;
    this.view.render();
  }
  /**
   * update line item.
   * @param {Number} id - lineItem id.
   * @param {Number} qty - quantity for line item.
   */
  ;

  _proto.updateItem = function updateItem(id, quantity) {
    var _this6 = this;

    this._userEvent('updateItemQuantity');

    var lineItem = {
      id: id,
      quantity: quantity
    };
    var lineItemEl = this.view.document.getElementById(id);

    if (lineItemEl) {
      var quantityEl = lineItemEl.getElementsByClassName(this.classes.lineItem.quantity)[0];

      if (quantityEl) {
        (0, _elementClass.addClassToElement)('is-loading', quantityEl);
      }
    }

    return this.props.client.checkout.updateLineItems(this.model.id, [lineItem]).then(function (checkout) {
      _this6.model = checkout;

      _this6.updateCache(_this6.model.lineItems);

      _this6.toggles.forEach(function (toggle) {
        return toggle.view.render();
      });

      if (quantity > 0) {
        _this6.view.render();
      } else {
        _this6.view.animateRemoveNode(id);
      }

      return checkout;
    });
  }
  /**
   * add variant to cart.
   * @param {Object} variant - variant object.
   * @param {Number} [quantity=1] - quantity to be added.
   */
  ;

  _proto.addVariantToCart = function addVariantToCart(variant) {
    var _this7 = this;

    var quantity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var openCart = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    if (quantity <= 0) {
      return null;
    }

    if (openCart) {
      this.open();
    }

    var lineItem = {
      variantId: variant.id,
      quantity: quantity
    };

    if (this.model) {
      return this.props.client.checkout.addLineItems(this.model.id, [lineItem]).then(function (checkout) {
        _this7.model = checkout;

        _this7.updateCache(_this7.model.lineItems);

        _this7.view.render();

        _this7.toggles.forEach(function (toggle) {
          return toggle.view.render();
        });

        if (!openCart) {
          _this7.setFocus();
        }

        return checkout;
      });
    } else {
      var input = {
        lineItems: [lineItem]
      };
      return this.props.client.checkout.create(input).then(function (checkout) {
        localStorage.setItem(_this7.localStorageCheckoutKey, checkout.id);
        _this7.model = checkout;

        _this7.updateCache(_this7.model.lineItems);

        _this7.view.render();

        _this7.toggles.forEach(function (toggle) {
          return toggle.view.render();
        });

        if (!openCart) {
          _this7.setFocus();
        }

        return checkout;
      });
    }
  }
  /**
   * Remove all lineItems in the cart
   */
  ;

  _proto.empty = function empty() {
    var _this8 = this;

    var lineItemIds = this.model.lineItems ? this.model.lineItems.map(function (item) {
      return item.id;
    }) : [];
    return this.props.client.checkout.removeLineItems(this.model.id, lineItemIds).then(function (checkout) {
      _this8.model = checkout;

      _this8.view.render();

      _this8.toggles.forEach(function (toggle) {
        return toggle.view.render();
      });

      return checkout;
    });
  }
  /**
   * get info about line item to be sent to tracker
   * @return {Object}
   */
  ;

  _proto.cartItemTrackingInfo = function cartItemTrackingInfo(item, quantity) {
    return {
      id: item.variant.id,
      variantName: item.variant.title,
      productId: item.variant.product.id,
      name: item.title,
      price: item.variant.priceV2.amount,
      prevQuantity: item.quantity,
      quantity: parseFloat(quantity),
      sku: null
    };
  };

  _proto.setFocus = function setFocus() {
    var _this9 = this;

    setTimeout(function () {
      _this9.view.setFocus();
    }, 0);
  };

  _createClass(Cart, [{
    key: "typeKey",
    get: function get() {
      return 'cart';
    }
    /**
     * get events to be bound to DOM.
     * @return {Object}
     */

  }, {
    key: "DOMEvents",
    get: function get() {
      var _merge;

      return (0, _merge2.default)({}, (_merge = {}, _defineProperty(_merge, "click ".concat(this.selectors.cart.close), this.props.closeCart.bind(this)), _defineProperty(_merge, "click ".concat(this.selectors.lineItem.quantityIncrement), this.onQuantityIncrement.bind(this, 1)), _defineProperty(_merge, "click ".concat(this.selectors.lineItem.quantityDecrement), this.onQuantityIncrement.bind(this, -1)), _defineProperty(_merge, "click ".concat(this.selectors.cart.button), this.onCheckout.bind(this)), _defineProperty(_merge, "blur ".concat(this.selectors.lineItem.quantityInput), this.onQuantityBlur.bind(this)), _defineProperty(_merge, "blur ".concat(this.selectors.cart.note), this.setNote.bind(this)), _merge), this.options.DOMEvents);
    }
    /**
     * get cart line items.
     * @return {Array} HTML
     */

  }, {
    key: "lineItems",
    get: function get() {
      return this.model ? this.model.lineItems : [];
    }
    /**
     * get HTML for cart line items.
     * @return {String} HTML
     */

  }, {
    key: "lineItemsHtml",
    get: function get() {
      var _this10 = this;

      return this.lineItemCache.reduce(function (acc, lineItem) {
        var data = Object.assign({}, lineItem, _this10.options.viewData);
        var fullPrice = data.variant.priceV2.amount * data.quantity;
        var formattedPrice = (0, _money.default)(fullPrice, _this10.moneyFormat);
        var discountAllocations = data.discountAllocations;

        var _discountAllocations$ = discountAllocations.reduce(function (discountAcc, discount) {
          var targetSelection = discount.discountApplication.targetSelection;

          if (LINE_ITEM_TARGET_SELECTIONS.indexOf(targetSelection) > -1) {
            var discountAmount = discount.allocatedAmount.amount;
            var discountDisplayText = discount.discountApplication.title || discount.discountApplication.code;
            discountAcc.totalDiscount += discountAmount;
            discountAcc.discounts.push({
              discount: "".concat(discountDisplayText, " (-").concat((0, _money.default)(discountAmount, _this10.moneyFormat), ")")
            });
          }

          return discountAcc;
        }, {
          discounts: [],
          totalDiscount: 0
        }),
            discounts = _discountAllocations$.discounts,
            totalDiscount = _discountAllocations$.totalDiscount;

        data.discounts = discounts.length > 0 ? discounts : null;
        data.formattedFullPrice = totalDiscount > 0 ? formattedPrice : null;
        data.formattedActualPrice = (0, _money.default)(fullPrice - totalDiscount, _this10.moneyFormat);
        data.formattedPrice = formattedPrice;
        data.classes = _this10.classes;
        data.text = _this10.config.lineItem.text;
        data.lineItemImage = _this10.imageForLineItem(data);
        data.variantTitle = data.variant.title === 'Default Title' ? '' : data.variant.title;
        return acc + _this10.childTemplate.render({
          data: data
        }, function (output) {
          return "<li id=\"".concat(lineItem.id, "\" class=").concat(_this10.classes.lineItem.lineItem, ">").concat(output, "</li>");
        });
      }, '');
    }
    /**
     * get data to be passed to view.
     * @return {Object} viewData object.
     */

  }, {
    key: "viewData",
    get: function get() {
      var modelData = this.model || {};
      return (0, _merge2.default)(modelData, this.options.viewData, {
        text: this.options.text,
        classes: this.classes,
        lineItemsHtml: this.lineItemsHtml,
        isEmpty: this.isEmpty,
        formattedTotal: this.formattedTotal,
        discounts: this.cartDiscounts,
        contents: this.options.contents,
        cartNote: this.cartNote,
        cartNoteId: this.cartNoteId
      });
    }
    /**
     * get formatted cart subtotal based on moneyFormat
     * @return {String}
     */

  }, {
    key: "formattedTotal",
    get: function get() {
      if (!this.model) {
        return (0, _money.default)(0, this.moneyFormat);
      }

      var total = this.options.contents.discounts ? this.model.subtotalPriceV2.amount : this.model.lineItemsSubtotalPrice.amount;
      return (0, _money.default)(total, this.moneyFormat);
    }
  }, {
    key: "cartDiscounts",
    get: function get() {
      var _this11 = this;

      if (!this.options.contents.discounts || !this.model) {
        return [];
      }

      return this.model.discountApplications.reduce(function (discountArr, discount) {
        if (discount.targetSelection === CART_TARGET_SELECTION) {
          var discountValue = 0;

          if (discount.value.amount) {
            discountValue = discount.value.amount;
          } else if (discount.value.percentage) {
            discountValue = discount.value.percentage / 100 * _this11.model.lineItemsSubtotalPrice.amount;
          }

          if (discountValue > 0) {
            var discountDisplayText = discount.title || discount.code;
            discountArr.push({
              text: discountDisplayText,
              amount: "-".concat((0, _money.default)(discountValue, _this11.moneyFormat))
            });
          }
        }

        return discountArr;
      }, []);
    }
    /**
     * whether cart is empty
     * @return {Boolean}
     */

  }, {
    key: "isEmpty",
    get: function get() {
      if (!this.model) {
        return true;
      }

      return this.model.lineItems.length < 1;
    }
  }, {
    key: "cartNote",
    get: function get() {
      return this.model && this.model.note;
    }
  }, {
    key: "cartNoteId",
    get: function get() {
      return "CartNote-".concat(Date.now());
    }
  }, {
    key: "wrapperClass",
    get: function get() {
      return this.isVisible ? 'is-active' : '';
    }
  }, {
    key: "localStorageCheckoutKey",
    get: function get() {
      return "".concat(this.props.client.config.storefrontAccessToken, ".").concat(this.props.client.config.domain, ".checkoutId");
    }
  }]);

  return Cart;
}(_component.default);

exports.default = Cart;