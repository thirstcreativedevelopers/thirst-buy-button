"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _product = _interopRequireDefault(require("./components/product"));

var _modal = _interopRequireDefault(require("./components/modal"));

var _productSet = _interopRequireDefault(require("./components/product-set"));

var _cart = _interopRequireDefault(require("./components/cart"));

var _toggle = _interopRequireDefault(require("./components/toggle"));

var _track = _interopRequireDefault(require("./utils/track"));

var _host = _interopRequireDefault(require("./styles/host/host"));

var _conditional = _interopRequireDefault(require("./styles/host/conditional"));

var _throttle = _interopRequireDefault(require("./utils/throttle"));

var _detectFeatures = _interopRequireDefault(require("./utils/detect-features"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DATA_ATTRIBUTE = 'data-shopify-buy-ui';
var ESC_KEY = 27;
/** Initializes and coordinates components. */

var UI =
/*#__PURE__*/
function () {
  /**
   * create a UI instance
   * @param {Object} client - Instance of ShopifyBuy Client
   * @param {Object} integrations - optional tracker and logger integrations
   * @param {String} styleOverrides - additional CSS to be added to _host_ style tag
   */
  function UI(client) {
    var integrations = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var styleOverrides = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    this.client = client;
    this.config = {};
    this.config.domain = this.client.config.domain;
    this.iframeComponents = [];
    this.components = {
      product: [],
      cart: [],
      collection: [],
      productSet: [],
      modal: [],
      toggle: []
    };
    this.componentTypes = {
      product: _product.default,
      cart: _cart.default,
      collection: _productSet.default,
      productSet: _productSet.default,
      toggle: _toggle.default
    };
    this.errorReporter = integrations.errorReporter;
    this.tracker = new _track.default(integrations.tracker, this.config);
    this.styleOverrides = styleOverrides;
    this.tracker.trackPageview();
    this.activeEl = null;

    this._appendStyleTag();

    this._bindResize();

    this._bindHostClick();

    this._bindEsc(window);

    this._bindPostMessage();
  }
  /**
   * create a component of a type.
   * @param {String} type - one of 'product', 'productSet', 'collection', 'cart'.
   * @param {Object} config - configuration object
   * @return {Promise} resolves to instance of newly created component.
   */


  var _proto = UI.prototype;

  _proto.createComponent = function createComponent(type, config) {
    var _this = this;

    config.node = config.node || this._queryEntryNode();
    var component = new this.componentTypes[type](config, this.componentProps);

    if (component.iframe) {
      this._bindEsc(component.iframe.el.contentWindow || component.iframe.el);
    }

    this.components[type].push(component);
    return component.init().then(function () {
      _this.trackComponent(type, component);

      return component;
    }).catch(function (error) {
      if (_this.errorReporter) {
        _this.errorReporter.notifyException(error);
      } // eslint-disable-next-line


      console.error(error);
    });
  };

  _proto.trackComponent = function trackComponent(type, component) {
    var _this2 = this;

    if (type === 'productSet') {
      component.trackingInfo.forEach(function (product) {
        _this2.tracker.trackComponent('product', product);
      });
    } else {
      this.tracker.trackComponent(type, component.trackingInfo);
    }
  }
  /**
   * destroy a component
   * @param {String} type - one of 'product', 'productSet', 'collection', 'cart'.
   * @param {Number} id - ID of the component's model.
   */
  ;

  _proto.destroyComponent = function destroyComponent(type, id) {
    var _this3 = this;

    this.components[type].forEach(function (component, index) {
      if (id && !component.model.id === id) {
        return;
      }

      _this3.components[type][index].destroy();

      _this3.components[type].splice(index, 1);
    });
  }
  /**
   * create a cart object to be shared between components.
   * @param {Object} config - configuration object.
   * @return {Promise} a promise which resolves once the cart has been initialized.
   */
  ;

  _proto.createCart = function createCart(config) {
    var _this4 = this;

    if (this.components.cart.length) {
      if (config.toggles && config.toggles.length > this.components.cart[0].toggles.length) {
        return this.components.cart[0].createToggles(config).then(function () {
          return _this4.components.cart[0];
        });
      }

      return Promise.resolve(this.components.cart[0]);
    } else {
      var cart = new _cart.default(config, this.componentProps);
      this.components.cart.push(cart);
      return cart.init();
    }
  }
  /**
   * close any cart.
   */
  ;

  _proto.closeCart = function closeCart() {
    var _this5 = this;

    if (!this.components.cart.length) {
      return;
    }

    this.components.cart.forEach(function (cart) {
      if (!cart.isVisible) {
        return;
      }

      cart.close();

      _this5.restoreFocus();
    });
  }
  /**
   * open any cart.
   */
  ;

  _proto.openCart = function openCart() {
    if (this.components.cart.length) {
      this.components.cart.forEach(function (cart) {
        cart.open();
      });
    }
  }
  /**
   * toggle visibility of cart.
   * @param {Boolean} [visibility] - desired state of cart.
   */
  ;

  _proto.toggleCart = function toggleCart(visibility) {
    if (this.components.cart.length) {
      this.components.cart.forEach(function (cart) {
        cart.toggleVisibility(visibility);
      });
    }

    if (!visibility) {
      this.restoreFocus();
    }
  }
  /**
   * create a modal object to be shared between components.
   * @param {Object} config - configuration object.
   * @return {Modal} a Modal instance.
   */
  ;

  _proto.createModal = function createModal(config) {
    if (this.components.modal.length) {
      return this.components.modal[0];
    } else {
      var modal = new _modal.default(config, this.componentProps);
      this.components.modal.push(modal);
      return modal;
    }
  };

  _proto.setActiveEl = function setActiveEl(el) {
    this.activeEl = el;
  }
  /**
   * close any modals.
   */
  ;

  _proto.closeModal = function closeModal() {
    if (!this.components.modal.length) {
      return;
    }

    this.components.modal.forEach(function (modal) {
      return modal.close();
    });
    this.restoreFocus();
  };

  _proto.restoreFocus = function restoreFocus() {
    if (this.activeEl && !this.modalOpen && !this.cartOpen) {
      this.activeEl.focus();
    }
  }
  /**
   * get properties to be passed to any component.
   * @return {Object} props object.
   */
  ;

  _proto._queryEntryNode = function _queryEntryNode() {
    this.entry = this.entry || window.document.querySelectorAll("script[".concat(DATA_ATTRIBUTE, "]"))[0];
    var div = document.createElement('div');

    if (this.entry) {
      var parentNode = this.entry.parentNode;

      if (parentNode.tagName === 'HEAD' || parentNode.tagName === 'HTML') {
        this._appendToBody(div);
      } else {
        this.entry.removeAttribute(DATA_ATTRIBUTE);
        parentNode.insertBefore(div, this.entry);
      }
    } else {
      this._appendToBody(div);
    }

    return div;
  };

  _proto._appendToBody = function _appendToBody(el) {
    if (!document.body) {
      document.body = document.createElement('body');
    }

    document.body.appendChild(el);
  };

  _proto._appendStyleTag = function _appendStyleTag() {
    var styleTag = document.createElement('style');

    if (styleTag.styleSheet) {
      styleTag.styleSheet.cssText = this.styleText;
    } else {
      styleTag.appendChild(document.createTextNode(this.styleText));
    }

    document.head.appendChild(styleTag);
  };

  _proto._bindHostClick = function _bindHostClick() {
    var _this6 = this;

    document.addEventListener('click', function (evt) {
      if (_this6.components.cart.length < 1) {
        return;
      }

      var cartNode = _this6.components.cart[0].node;

      if (evt.target === cartNode || cartNode.contains(evt.target)) {
        return;
      }

      _this6.closeCart();
    });
  };

  _proto._bindResize = function _bindResize() {
    var _this7 = this;

    (0, _throttle.default)('resize', 'safeResize');
    window.addEventListener('safeResize', function () {
      _this7.components.collection.forEach(function (collection) {
        return collection.view.resize();
      });

      _this7.components.productSet.forEach(function (set) {
        return set.view.resize();
      });

      _this7.components.product.forEach(function (product) {
        return product.view.resize();
      });
    });
  };

  _proto._bindEsc = function _bindEsc(context) {
    var _this8 = this;

    context.addEventListener('keydown', function (evt) {
      if (evt.keyCode !== ESC_KEY) {
        return;
      }

      _this8.closeModal();

      _this8.closeCart();
    });
  };

  _proto._bindPostMessage = function _bindPostMessage() {
    window.addEventListener('message', function (msg) {
      var data;

      try {
        data = JSON.parse(msg.data);
      } catch (err) {
        data = {};
      }

      if (data.syncCart || data.current_checkout_page && data.current_checkout_page === '/checkout/thank_you') {
        location.reload();
      }
    });
  };

  _createClass(UI, [{
    key: "modalOpen",
    get: function get() {
      return this.components.modal.reduce(function (isOpen, modal) {
        return isOpen || modal.isVisible;
      }, false);
    }
  }, {
    key: "cartOpen",
    get: function get() {
      return this.components.cart.reduce(function (isOpen, cart) {
        return isOpen || cart.isVisible;
      }, false);
    }
  }, {
    key: "componentProps",
    get: function get() {
      return {
        client: this.client,
        createCart: this.createCart.bind(this),
        closeCart: this.closeCart.bind(this),
        toggleCart: this.toggleCart.bind(this),
        createModal: this.createModal.bind(this),
        closeModal: this.closeModal.bind(this),
        setActiveEl: this.setActiveEl.bind(this),
        destroyComponent: this.destroyComponent.bind(this),
        tracker: this.tracker,
        errorReporter: this.errorReporter,
        browserFeatures: _detectFeatures.default
      };
    }
    /**
     * get string of CSS to be inserted into host style tag.
     */

  }, {
    key: "styleText",
    get: function get() {
      if (_detectFeatures.default.transition && _detectFeatures.default.transform && _detectFeatures.default.animation) {
        return _host.default + this.styleOverrides;
      }

      return _host.default + _conditional.default + this.styleOverrides;
    }
  }]);

  return UI;
}();

exports.default = UI;