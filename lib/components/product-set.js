"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _merge = _interopRequireDefault(require("../utils/merge"));

var _component = _interopRequireDefault(require("../component"));

var _product = _interopRequireDefault(require("./product"));

var _template = _interopRequireDefault(require("../template"));

var _productSet = _interopRequireDefault(require("../updaters/product-set"));

var _productSet2 = _interopRequireDefault(require("../views/product-set"));

var _normalizeConfig = _interopRequireDefault(require("../utils/normalize-config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function isArray(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
}
/**
 * Renders and fetches data for collection and product set embed.
 * @extends Component.
 */


var ProductSet =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(ProductSet, _Component);

  /**
   * create ProductSet
   * @param {Object} config - configuration object.
   * @param {Object} props - data and utilities passed down from UI instance.
   */
  function ProductSet(config, props) {
    var _this;

    if (Array.isArray(config.id)) {
      // eslint-disable-next-line no-param-reassign
      config = (0, _normalizeConfig.default)(config);
    } else {
      // eslint-disable-next-line no-param-reassign
      config = (0, _normalizeConfig.default)(config, 'Collection');
    }

    _this = _Component.call(this, config, props) || this;
    _this.typeKey = 'productSet';
    _this.products = [];
    _this.cart = null;
    _this.page = 1;
    _this.nextModel = {
      products: []
    };
    _this.updater = new _productSet.default(_assertThisInitialized(_this));
    _this.view = new _productSet2.default(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = ProductSet.prototype;

  /**
   * initializes component by creating model and rendering view.
   * Creates and initalizes cart if necessary.
   * Calls renderProducts.
   * @param {Object} [data] - data to initialize model with.
   * @return {Promise} promise resolving to instance.
   */
  _proto.init = function init(data) {
    var _this2 = this;

    var cartConfig = Object.assign({}, this.globalConfig, {
      node: this.globalConfig.cartNode,
      options: this.config
    });
    return this.props.createCart(cartConfig).then(function (cart) {
      _this2.cart = cart;
      return _Component.prototype.init.call(_this2, data).then(function (model) {
        if (model) {
          return _this2.renderProducts(_this2.model.products);
        }

        return _this2;
      });
    });
  }
  /**
   * fetches products from SDK based on provided config information.
   * @param {Object} options - query options for request
   * @return {Promise} promise resolving to collection data.
   */
  ;

  _proto.sdkFetch = function sdkFetch() {
    var _this3 = this;

    var promise;

    if (this.storefrontId) {
      if (Array.isArray(this.storefrontId)) {
        promise = this.props.client.product.fetchMultiple(this.storefrontId);
      } else {
        promise = this.props.client.collection.fetchWithProducts(this.storefrontId);
      }
    } else if (this.handle) {
      promise = this.props.client.collection.fetchByHandle(this.handle).then(function (collection) {
        _this3.storefrontId = collection.id;
        return _this3.props.client.collection.fetchWithProducts(_this3.storefrontId);
      });
    }

    return promise.then(function (collectionOrProducts) {
      var products;

      if (Array.isArray(collectionOrProducts)) {
        products = collectionOrProducts;
      } else {
        products = collectionOrProducts.products;
      }

      return products;
    });
  }
  /**
   * call sdkFetch and set model.products to products array.
   * @throw 'Not Found' if model not returned.
   * @return {Promise} promise resolving to model data.
   */
  ;

  _proto.fetchData = function fetchData() {
    return this.sdkFetch().then(function (products) {
      if (products.length) {
        return {
          products: products
        };
      }

      throw new Error('Not Found');
    });
  }
  /**
   * make request to SDK for next page. Render button if products on next page exist.
   * @return {Promise} promise resolving when button is rendered or not.
   */
  ;

  _proto.showPagination = function showPagination() {
    var _this4 = this;

    return this.props.client.fetchNextPage(this.model.products).then(function (data) {
      _this4.nextModel = {
        products: data.model
      };

      _this4.view.renderChild(_this4.classes.productSet.paginationButton, _this4.paginationTemplate);

      _this4.view.resize();

      return;
    });
  }
  /**
   * append next page worth of products into the DOM
   */
  ;

  _proto.nextPage = function nextPage() {
    this.model = this.nextModel;

    this._userEvent('loadNextPage');

    this.renderProducts();
  }
  /**
   * render product components into productSet container. Show pagination button if necessary.
   * @return {Promise} promise resolving to instance.
   */
  ;

  _proto.renderProducts = function renderProducts() {
    var _this5 = this;

    if (!this.model.products.length) {
      return Promise.resolve();
    }

    var productConfig = Object.assign({}, this.globalConfig, {
      node: this.view.document.querySelector(".".concat(this.classes.productSet.products)),
      options: (0, _merge.default)({}, this.config, {
        product: {
          iframe: false,
          classes: {
            wrapper: this.classes.productSet.product
          }
        }
      })
    });

    if (this.config.productSet.iframe === false) {
      productConfig.node = this.node.querySelector(".".concat(this.classes.productSet.products));
    }

    var promises = this.model.products.map(function (productModel) {
      var product = new _product.default(productConfig, _this5.props);

      _this5.products.push(product);

      return product.init(productModel);
    });
    return Promise.all(promises).then(function () {
      _this5.view.resizeUntilFits();

      var hasPagination = _this5.model.products[0].hasOwnProperty('hasNextPage');

      if (_this5.options.contents.pagination && hasPagination) {
        _this5.showPagination();
      }

      return _this5;
    });
  };

  _createClass(ProductSet, [{
    key: "nextButtonClass",
    get: function get() {
      return this.nextModel.products.length ? 'is-active' : '';
    }
    /**
     * get data to be passed to view.
     * @return {Object} viewData object.
     */

  }, {
    key: "viewData",
    get: function get() {
      return Object.assign({}, this.options.viewData, {
        classes: this.classes,
        text: this.options.text,
        nextButtonClass: this.nextButtonClass
      });
    }
    /**
     * get events to be bound to DOM.
     * @return {Object}
     */

  }, {
    key: "DOMEvents",
    get: function get() {
      return Object.assign({}, _defineProperty({
        click: this.props.closeCart.bind(this)
      }, "click ".concat(this.selectors.productSet.paginationButton), this.nextPage.bind(this)), this.options.DOMEvents);
    }
    /**
     * get template for rendering pagination button.
     * @return {Object} Template instance
     */

  }, {
    key: "paginationTemplate",
    get: function get() {
      this._paginationTemplate = this._paginationTemplate || new _template.default({
        pagination: this.options.templates.pagination
      }, {
        pagination: true
      }, ['pagination']);
      return this._paginationTemplate;
    }
    /**
     * get info about collection or set to be sent to tracker
     * @return {Object|Array}
     */

  }, {
    key: "trackingInfo",
    get: function get() {
      var contents = this.config.product.contents;
      var contentString = Object.keys(contents).filter(function (key) {
        return contents[key];
      }).toString();
      var config = {
        destination: this.config.product.buttonDestination,
        layout: this.config.product.layout,
        contents: contentString,
        checkoutPopup: this.config.cart.popup
      };

      if (isArray(this.id)) {
        return this.model.products.map(function (product) {
          var variant = product.variants[0];
          return Object.assign({}, config, {
            id: product.id,
            name: product.title,
            variantId: variant.id,
            variantName: variant.title,
            price: variant.priceV2.amount,
            sku: null,
            isProductSet: true
          });
        });
      }

      return Object.assign(config, {
        id: this.storefrontId
      });
    }
  }]);

  return ProductSet;
}(_component.default);

exports.default = ProductSet;