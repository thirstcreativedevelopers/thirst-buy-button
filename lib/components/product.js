"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _merge2 = _interopRequireDefault(require("../utils/merge"));

var _component = _interopRequireDefault(require("../component"));

var _template = _interopRequireDefault(require("../template"));

var _checkout = _interopRequireDefault(require("./checkout"));

var _windowUtils = _interopRequireDefault(require("../utils/window-utils"));

var _money = _interopRequireDefault(require("../utils/money"));

var _normalizeConfig = _interopRequireDefault(require("../utils/normalize-config"));

var _detectFeatures = _interopRequireDefault(require("../utils/detect-features"));

var _unitPrice = _interopRequireDefault(require("../utils/unit-price"));

var _product = _interopRequireDefault(require("../views/product"));

var _product2 = _interopRequireDefault(require("../updaters/product"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function isFunction(obj) {
  return Boolean(obj && obj.constructor && obj.call && obj.apply);
}

function isPseudoSelector(key) {
  return key.charAt(0) === ':';
}

function isMedia(key) {
  return key.charAt(0) === '@';
}

var ENTER_KEY = 13;
var propertiesWhitelist = ['background', 'background-color', 'border', 'border-radius', 'color', 'border-color', 'border-width', 'border-style', 'transition', 'text-transform', 'text-shadow', 'box-shadow', 'font-size', 'font-family'];

function whitelistedProperties(selectorStyles) {
  return Object.keys(selectorStyles).reduce(function (filteredStyles, propertyName) {
    if (isPseudoSelector(propertyName) || isMedia(propertyName)) {
      filteredStyles[propertyName] = whitelistedProperties(selectorStyles[propertyName]);
      return filteredStyles;
    }

    if (propertiesWhitelist.indexOf(propertyName) > -1) {
      filteredStyles[propertyName] = selectorStyles[propertyName];
    }

    return filteredStyles;
  }, {});
}
/**
 * Renders and fetches data for product embed.
 * @extends Component.
 */


var Product =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(Product, _Component);

  /**
   * create Product.
   * @param {Object} config - configuration object.
   * @param {Object} props - data and utilities passed down from UI instance.
   */
  function Product(config, props) {
    var _this;

    // eslint-disable-next-line no-param-reassign
    config = (0, _normalizeConfig.default)(config);
    _this = _Component.call(this, config, props) || this;
    _this.typeKey = 'product';
    _this.defaultStorefrontVariantId = config.storefrontVariantId;
    _this.cachedImage = null;
    _this.childTemplate = new _template.default(_this.config.option.templates, _this.config.option.contents, _this.config.option.order);
    _this.cart = null;
    _this.modal = null;
    _this.imgStyle = '';
    _this.selectedQuantity = 1;
    _this.selectedVariant = {};
    _this.selectedOptions = {};
    _this.selectedImage = null;
    _this.modalProduct = Boolean(config.modalProduct);
    _this.updater = new _product2.default(_assertThisInitialized(_this));
    _this.view = new _product.default(_assertThisInitialized(_this));
    return _this;
  }
  /**
   * determines when image src should be updated
   * @return {Boolean}
   */


  var _proto = Product.prototype;

  /**
   * prevent events from bubbling if entire product is being treated as button.
   */
  _proto.stopPropagation = function stopPropagation(evt) {
    if (this.isButton) {
      evt.stopImmediatePropagation();
    }
  }
  /**
   * get HTML for product options selector.
   * @return {String} HTML
   */
  ;

  /**
   * determines whether an option can resolve to an available variant given current selections
   * @return {Boolean}
   */
  _proto.optionValueCanBeSelected = function optionValueCanBeSelected(selections, name, value) {
    var variants = this.variantArray;
    var selectableValues = Object.assign({}, selections, _defineProperty({}, name, value));
    var satisfactoryVariants = variants.filter(function (variant) {
      var matchingOptions = Object.keys(selectableValues).filter(function (key) {
        return variant.optionValues[key] === selectableValues[key];
      });
      return matchingOptions.length === Object.keys(selectableValues).length;
    });
    var variantSelectable = false;
    variantSelectable = satisfactoryVariants.reduce(function (variantExists, variant) {
      var variantAvailable = variant.available;

      if (!variantExists) {
        return variantAvailable;
      }

      return variantExists;
    }, false);
    return variantSelectable;
  }
  /**
   * get options for product with selected value.
   * @return {Array}
   */
  ;

  /**
   * open online store in new tab.
   */
  _proto.openOnlineStore = function openOnlineStore() {
    this._userEvent('openOnlineStore');

    window.open(this.onlineStoreURL);
  }
  /**
   * initializes component by creating model and rendering view.
   * Creates and initalizes cart if necessary.
   * @param {Object} [data] - data to initialize model with.
   * @return {Promise} promise resolving to instance.
   */
  ;

  _proto.init = function init(data) {
    var _this2 = this;

    return this.createCart().then(function (cart) {
      _this2.cart = cart;
      return _Component.prototype.init.call(_this2, data).then(function (model) {
        if (model) {
          _this2.view.render();
        }

        return model;
      });
    });
  }
  /**
   * creates cart if necessary.
   * @return {Promise}
   */
  ;

  _proto.createCart = function createCart() {
    var cartConfig = Object.assign({}, this.globalConfig, {
      node: this.globalConfig.cartNode,
      options: this.config
    });
    return this.props.createCart(cartConfig);
  }
  /**
   * fetches data if necessary.
   * Sets default variant for product.
   * @param {Object} [data] - data to initialize model with.
   */
  ;

  _proto.setupModel = function setupModel(data) {
    var _this3 = this;

    return _Component.prototype.setupModel.call(this, data).then(function (model) {
      return _this3.setDefaultVariant(model);
    });
  }
  /**
   * fetch product data from API.
   * @return {Promise} promise resolving to model data.
   */
  ;

  _proto.sdkFetch = function sdkFetch() {
    if (this.storefrontId && Array.isArray(this.storefrontId) && this.storefrontId[0]) {
      return this.props.client.product.fetch(this.storefrontId[0]);
    } else if (this.storefrontId && !Array.isArray(this.storefrontId)) {
      return this.props.client.product.fetch(this.storefrontId);
    } else if (this.handle) {
      return this.props.client.product.fetchByHandle(this.handle).then(function (product) {
        return product;
      });
    }

    return Promise.reject(new Error('SDK Fetch Failed'));
  }
  /**
   * call sdkFetch and set selected quantity to 0.
   * @throw 'Not Found' if model not returned.
   * @return {Promise} promise resolving to model data.
   */
  ;

  _proto.fetchData = function fetchData() {
    var _this4 = this;

    return this.sdkFetch().then(function (model) {
      if (model) {
        _this4.storefrontId = model.id;
        _this4.handle = model.handle;
        return model;
      }

      throw new Error('Not Found');
    });
  };

  _proto.onButtonClick = function onButtonClick(evt, target) {
    evt.stopPropagation();

    if (isFunction(this.options.buttonDestination)) {
      this.options.buttonDestination(this);
    } else if (this.options.buttonDestination === 'cart') {
      this.props.closeModal();

      this._userEvent('addVariantToCart');

      this.props.tracker.trackMethod(this.cart.addVariantToCart.bind(this), 'Update Cart', this.selectedVariantTrackingInfo)(this.selectedVariant, this.selectedQuantity);

      if (!this.modalProduct) {
        this.props.setActiveEl(target);
      }
    } else if (this.options.buttonDestination === 'modal') {
      this.props.setActiveEl(target);
      this.props.tracker.track('Open modal', this.productTrackingInfo);
      this.openModal();
    } else if (this.options.buttonDestination === 'onlineStore') {
      this.openOnlineStore();
    } else {
      this._userEvent('openCheckout');

      this.props.tracker.track('Direct Checkout', {});
      var checkoutWindow;

      if (this.config.cart.popup && _detectFeatures.default.windowOpen()) {
        var params = new _checkout.default(this.config).params;
        checkoutWindow = window.open('', 'checkout', params);
      } else {
        checkoutWindow = window;
      }

      var input = {
        lineItems: [{
          variantId: this.selectedVariant.id,
          quantity: this.selectedQuantity
        }]
      };
      this.props.client.checkout.create(input).then(function (checkout) {
        checkoutWindow.location = checkout.webUrl;
      });
    }
  };

  _proto.onBlockButtonKeyup = function onBlockButtonKeyup(evt, target) {
    if (evt.keyCode === ENTER_KEY) {
      this.onButtonClick(evt, target);
    }
  };

  _proto.onOptionSelect = function onOptionSelect(evt) {
    var target = evt.target;
    var value = target.options[target.selectedIndex].value;
    var name = target.getAttribute('name');
    this.updateVariant(name, value);
  };

  _proto.onQuantityBlur = function onQuantityBlur(evt, target) {
    this.updateQuantity(function () {
      return parseInt(target.value, 10);
    });
  };

  _proto.onQuantityIncrement = function onQuantityIncrement(qty) {
    this.updateQuantity(function (prevQty) {
      return prevQty + qty;
    });
  };

  _proto.closeCartOnBgClick = function closeCartOnBgClick() {
    if (this.cart && this.cart.isVisible) {
      this.cart.close();
    }
  };

  _proto.onCarouselItemClick = function onCarouselItemClick(evt, target) {
    evt.preventDefault();
    var selectedImageId = target.getAttribute('data-image-id');
    var imageList = this.model.images;
    var foundImage = imageList.find(function (image) {
      return image.id === selectedImageId;
    });

    if (foundImage) {
      this.selectedImage = foundImage;
      this.cachedImage = foundImage;
    }

    this.view.render();
  };

  _proto.nextIndex = function nextIndex(currentIndex, offset) {
    var nextIndex = currentIndex + offset;

    if (nextIndex >= this.model.images.length) {
      return 0;
    }

    if (nextIndex < 0) {
      return this.model.images.length - 1;
    }

    return nextIndex;
  };

  _proto.onCarouselChange = function onCarouselChange(offset) {
    var _this5 = this;

    var imageList = this.model.images;
    var currentImage = imageList.filter(function (image) {
      return image.id === _this5.currentImage.id;
    })[0];
    var currentImageIndex = imageList.indexOf(currentImage);
    this.selectedImage = imageList[this.nextIndex(currentImageIndex, offset)];
    this.cachedImage = this.selectedImage;
    this.view.render();
  }
  /**
   * create modal instance and initialize.
   * @return {Promise} promise resolving to modal instance
   */
  ;

  _proto.openModal = function openModal() {
    if (!this.modal) {
      var modalConfig = Object.assign({}, this.globalConfig, {
        node: this.globalConfig.modalNode,
        options: Object.assign({}, this.config, {
          product: this.modalProductConfig,
          modal: Object.assign({}, this.config.modal, {
            googleFonts: this.options.googleFonts
          })
        })
      });
      this.modal = this.props.createModal(modalConfig, this.props);
    }

    this._userEvent('openModal');

    return this.modal.init(this.model);
  }
  /**
   * update quantity of selected variant and rerender.
   * @param {Function} fn - function which returns new quantity given current quantity.
   */
  ;

  _proto.updateQuantity = function updateQuantity(fn) {
    var quantity = fn(this.selectedQuantity);

    if (quantity < 0) {
      quantity = 0;
    }

    this.selectedQuantity = quantity;

    this._userEvent('updateQuantity');

    this.view.render();
  }
  /**
   * Update variant based on option value.
   * @param {String} optionName - name of option being modified.
   * @param {String} value - value of selected option.
   * @return {Object} updated option object.
   */
  ;

  _proto.updateVariant = function updateVariant(optionName, value) {
    var _this6 = this;

    var updatedOption = this.model.options.find(function (option) {
      return option.name === optionName;
    });

    if (updatedOption) {
      this.selectedOptions[updatedOption.name] = value;
      this.selectedVariant = this.props.client.product.helpers.variantForOptions(this.model, this.selectedOptions);
    }

    if (this.variantExists) {
      this.cachedImage = this.selectedVariant.image;

      if (this.selectedVariant.image) {
        this.selectedImage = null;
      } else {
        this.selectedImage = this.model.images[0]; // get cached image
      }
    } else {
      this.selectedImage = this.model.images.find(function (image) {
        return image.id === _this6.cachedImage.id;
      });
    }

    this.view.render();

    this._userEvent('updateVariant');

    return updatedOption;
  }
  /**
   * set default variant to be selected on initialization.
   * @param {Object} model - model to be modified.
   */
  ;

  _proto.setDefaultVariant = function setDefaultVariant(model) {
    var _this7 = this;

    var selectedVariant;

    if (this.defaultStorefrontVariantId) {
      selectedVariant = model.variants.find(function (variant) {
        return variant.id === _this7.defaultStorefrontVariantId;
      });
    } else {
      this.defaultStorefrontVariantId = model.variants[0].id;
      selectedVariant = model.variants[0];
      this.selectedImage = model.images[0];
    }

    if (!selectedVariant) {
      selectedVariant = model.variants[0];
    }

    this.selectedOptions = selectedVariant.selectedOptions.reduce(function (acc, option) {
      acc[option.name] = option.value;
      return acc;
    }, {});
    this.selectedVariant = selectedVariant;
    return model;
  };

  _proto.imageAltText = function imageAltText(altText) {
    return altText || this.model.title;
  };

  _createClass(Product, [{
    key: "shouldUpdateImage",
    get: function get() {
      return !this.cachedImage || this.image && this.image.src !== this.cachedImage;
    }
    /**
     * get image for product and cache it. Return caches image if shouldUpdateImage is false.
     * @return {Object} image objcet.
     */

  }, {
    key: "currentImage",
    get: function get() {
      if (this.shouldUpdateImage) {
        this.cachedImage = this.image;
      }

      return this.cachedImage;
    }
    /**
     * get image for selected variant and size based on options or layout.
     * @return {Object} image object.
     */

  }, {
    key: "image",
    get: function get() {
      var DEFAULT_IMAGE_SIZE = 480;
      var MODAL_IMAGE_SIZE = 550;

      if (!(this.selectedVariant || this.options.contents.imgWithCarousel)) {
        return null;
      }

      var imageSize;

      if (this.options.width && this.options.width.slice(-1) === '%') {
        imageSize = 1000;
      } else {
        imageSize = parseInt(this.options.width, 10) || DEFAULT_IMAGE_SIZE;
      }

      var id;
      var src;
      var srcLarge;
      var srcOriginal;
      var altText;
      var imageOptions = {
        maxWidth: imageSize,
        maxHeight: imageSize * 1.5
      };
      var imageOptionsLarge = {
        maxWidth: MODAL_IMAGE_SIZE,
        maxHeight: MODAL_IMAGE_SIZE * 1.5
      };

      if (this.selectedImage) {
        id = this.selectedImage.id;
        src = this.props.client.image.helpers.imageForSize(this.selectedImage, imageOptions);
        srcLarge = this.props.client.image.helpers.imageForSize(this.selectedImage, imageOptionsLarge);
        srcOriginal = this.selectedImage.src;
        altText = this.imageAltText(this.selectedImage.altText);
      } else if (this.selectedVariant.image == null && this.model.images[0] == null) {
        id = null;
        src = '';
        srcLarge = '';
        srcOriginal = '';
        altText = '';
      } else if (this.selectedVariant.image == null) {
        id = this.model.images[0].id;
        src = this.model.images[0].src;
        srcLarge = this.props.client.image.helpers.imageForSize(this.model.images[0], imageOptionsLarge);
        srcOriginal = this.model.images[0].src;
        altText = this.imageAltText(this.model.images[0].altText);
      } else {
        id = this.selectedVariant.image.id;
        src = this.props.client.image.helpers.imageForSize(this.selectedVariant.image, imageOptions);
        srcLarge = this.props.client.image.helpers.imageForSize(this.selectedVariant.image, imageOptionsLarge);
        srcOriginal = this.selectedVariant.image.src;
        altText = this.imageAltText(this.selectedVariant.image.altText);
      }

      return {
        id: id,
        src: src,
        srcLarge: srcLarge,
        srcOriginal: srcOriginal,
        altText: altText
      };
    }
    /**
     * get formatted cart subtotal based on moneyFormat
     * @return {String}
     */

  }, {
    key: "formattedPrice",
    get: function get() {
      if (!this.selectedVariant) {
        return '';
      }

      return (0, _money.default)(this.selectedVariant.priceV2.amount, this.globalConfig.moneyFormat);
    }
    /**
     * get formatted cart subtotal based on moneyFormat
     * @return {String}
     */

  }, {
    key: "formattedCompareAtPrice",
    get: function get() {
      if (!this.hasCompareAtPrice) {
        return '';
      }

      return (0, _money.default)(this.selectedVariant.compareAtPriceV2.amount, this.globalConfig.moneyFormat);
    }
    /**
     * get whether unit price string should be displayed
     * @return {Boolean}
     */

  }, {
    key: "showUnitPrice",
    get: function get() {
      if (!this.selectedVariant || !this.selectedVariant.unitPrice || !this.options.contents.unitPrice) {
        return false;
      }

      return true;
    }
    /**
     * get formatted variant unit price amount based on moneyFormat
     * @return {String}
     */

  }, {
    key: "formattedUnitPrice",
    get: function get() {
      if (!this.showUnitPrice) {
        return '';
      }

      return (0, _money.default)(this.selectedVariant.unitPrice.amount, this.globalConfig.moneyFormat);
    }
    /**
     * get formatted variant unit price base unit
     * @return {String}
     */

  }, {
    key: "formattedUnitPriceBaseUnit",
    get: function get() {
      if (!this.showUnitPrice) {
        return '';
      }

      var unitPriceMeasurement = this.selectedVariant.unitPriceMeasurement;
      return (0, _unitPrice.default)(unitPriceMeasurement.referenceValue, unitPriceMeasurement.referenceUnit);
    }
    /**
     * get data to be passed to view.
     * @return {Object} viewData object.
     */

  }, {
    key: "viewData",
    get: function get() {
      return Object.assign({}, this.model, this.options.viewData, {
        classes: this.classes,
        contents: this.options.contents,
        text: this.options.text,
        optionsHtml: this.optionsHtml,
        decoratedOptions: this.decoratedOptions,
        currentImage: this.currentImage,
        buttonClass: this.buttonClass,
        hasVariants: this.hasVariants,
        buttonDisabled: !this.buttonEnabled,
        selectedVariant: this.selectedVariant,
        selectedQuantity: this.selectedQuantity,
        buttonText: this.buttonText,
        imgStyle: this.imgStyle,
        quantityClass: this.quantityClass,
        priceClass: this.priceClass,
        formattedPrice: this.formattedPrice,
        priceAccessibilityLabel: this.priceAccessibilityLabel,
        hasCompareAtPrice: this.hasCompareAtPrice,
        formattedCompareAtPrice: this.formattedCompareAtPrice,
        compareAtPriceAccessibilityLabel: this.compareAtPriceAccessibilityLabel,
        showUnitPrice: this.showUnitPrice,
        formattedUnitPrice: this.formattedUnitPrice,
        formattedUnitPriceBaseUnit: this.formattedUnitPriceBaseUnit,
        carouselIndex: 0,
        carouselImages: this.carouselImages
      });
    }
  }, {
    key: "carouselImages",
    get: function get() {
      var _this8 = this;

      return this.model.images.map(function (image) {
        return {
          id: image.id,
          src: image.src,
          carouselSrc: _this8.props.client.image.helpers.imageForSize(image, {
            maxWidth: 100,
            maxHeight: 100
          }),
          isSelected: image.id === _this8.currentImage.id,
          altText: _this8.imageAltText(image.altText)
        };
      });
    }
  }, {
    key: "buttonClass",
    get: function get() {
      var disabledClass = this.buttonEnabled ? '' : this.classes.product.disabled;
      var quantityClass = this.options.contents.buttonWithQuantity ? this.classes.product.buttonBesideQty : '';
      return "".concat(disabledClass, " ").concat(quantityClass);
    }
  }, {
    key: "quantityClass",
    get: function get() {
      return this.options.contents.quantityIncrement || this.options.contents.quantityDecrement ? this.classes.product.quantityWithButtons : '';
    }
  }, {
    key: "buttonText",
    get: function get() {
      if (this.options.buttonDestination === 'modal') {
        return this.options.text.button;
      }

      if (!this.variantExists) {
        return this.options.text.unavailable;
      }

      if (!this.variantInStock) {
        return this.options.text.outOfStock;
      }

      return this.options.text.button;
    }
  }, {
    key: "buttonEnabled",
    get: function get() {
      return this.options.buttonDestination === 'modal' || this.buttonActionAvailable && this.variantExists && this.variantInStock;
    }
  }, {
    key: "variantExists",
    get: function get() {
      var _this9 = this;

      return this.model.variants.some(function (variant) {
        if (_this9.selectedVariant) {
          return variant.id === _this9.selectedVariant.id;
        } else {
          return false;
        }
      });
    }
  }, {
    key: "variantInStock",
    get: function get() {
      return this.variantExists && this.selectedVariant.available;
    }
  }, {
    key: "hasVariants",
    get: function get() {
      return this.model.variants.length > 1;
    }
  }, {
    key: "requiresCart",
    get: function get() {
      return this.options.buttonDestination === 'cart';
    }
  }, {
    key: "buttonActionAvailable",
    get: function get() {
      return !this.requiresCart || Boolean(this.cart);
    }
  }, {
    key: "hasQuantity",
    get: function get() {
      return this.options.contents.quantityInput;
    }
  }, {
    key: "priceClass",
    get: function get() {
      return this.hasCompareAtPrice ? this.classes.product.loweredPrice : '';
    }
  }, {
    key: "isButton",
    get: function get() {
      return this.options.isButton && !(this.options.contents.button || this.options.contents.buttonWithQuantity);
    }
    /**
     * get events to be bound to DOM.
     * @return {Object}
     */

  }, {
    key: "DOMEvents",
    get: function get() {
      var _merge;

      return (0, _merge2.default)({}, (_merge = {
        click: this.closeCartOnBgClick.bind(this)
      }, _defineProperty(_merge, "click ".concat(this.selectors.option.select), this.stopPropagation.bind(this)), _defineProperty(_merge, "focus ".concat(this.selectors.option.select), this.stopPropagation.bind(this)), _defineProperty(_merge, "click ".concat(this.selectors.option.wrapper), this.stopPropagation.bind(this)), _defineProperty(_merge, "click ".concat(this.selectors.product.quantityInput), this.stopPropagation.bind(this)), _defineProperty(_merge, "click ".concat(this.selectors.product.quantityButton), this.stopPropagation.bind(this)), _defineProperty(_merge, "change ".concat(this.selectors.option.select), this.onOptionSelect.bind(this)), _defineProperty(_merge, "click ".concat(this.selectors.product.button), this.onButtonClick.bind(this)), _defineProperty(_merge, "click ".concat(this.selectors.product.blockButton), this.onButtonClick.bind(this)), _defineProperty(_merge, "keyup ".concat(this.selectors.product.blockButton), this.onBlockButtonKeyup.bind(this)), _defineProperty(_merge, "click ".concat(this.selectors.product.quantityIncrement), this.onQuantityIncrement.bind(this, 1)), _defineProperty(_merge, "click ".concat(this.selectors.product.quantityDecrement), this.onQuantityIncrement.bind(this, -1)), _defineProperty(_merge, "blur ".concat(this.selectors.product.quantityInput), this.onQuantityBlur.bind(this)), _defineProperty(_merge, "click ".concat(this.selectors.product.carouselItem), this.onCarouselItemClick.bind(this)), _defineProperty(_merge, "click ".concat(this.selectors.product.carouselNext), this.onCarouselChange.bind(this, 1)), _defineProperty(_merge, "click ".concat(this.selectors.product.carouselPrevious), this.onCarouselChange.bind(this, -1)), _merge), this.options.DOMEvents);
    }
  }, {
    key: "optionsHtml",
    get: function get() {
      var _this10 = this;

      if (!this.options.contents.options) {
        return '';
      }

      var uniqueId = Date.now();
      return this.decoratedOptions.reduce(function (acc, option, index) {
        var data = (0, _merge2.default)(option, _this10.options.viewData);
        data.classes = _this10.classes;
        data.selectId = "Option-".concat(uniqueId, "-").concat(index);
        data.onlyOption = _this10.model.options.length === 1;
        return acc + _this10.childTemplate.render({
          data: data
        });
      }, '');
    }
    /**
     * get product variants with embedded options
     * @return {Array} array of variants
     */

  }, {
    key: "variantArray",
    get: function get() {
      delete this.variantArrayMemo;
      this.variantArrayMemo = this.model.variants.map(function (variant) {
        var betterVariant = {
          id: variant.id,
          available: variant.available,
          optionValues: {}
        };
        variant.optionValues.forEach(function (optionValue) {
          betterVariant.optionValues[optionValue.name] = optionValue.value;
        });
        return betterVariant;
      });
      return this.variantArrayMemo;
    }
  }, {
    key: "decoratedOptions",
    get: function get() {
      var _this11 = this;

      return this.model.options.map(function (option) {
        return {
          name: option.name,
          values: option.values.map(function (value) {
            return {
              name: value.value,
              selected: _this11.selectedOptions[option.name] === value.value
            };
          })
        };
      });
    }
    /**
     * get info about product to be sent to tracker
     * @return {Object}
     */

  }, {
    key: "trackingInfo",
    get: function get() {
      var variant = this.selectedVariant || this.model.variants[0];
      var contents = this.options.contents;
      var contentString = Object.keys(contents).filter(function (key) {
        return contents[key];
      }).toString();
      return {
        id: this.model.id,
        name: this.model.title,
        variantId: variant.id,
        variantName: variant.title,
        price: variant.priceV2.amount,
        destination: this.options.buttonDestination,
        layout: this.options.layout,
        contents: contentString,
        checkoutPopup: this.config.cart.popup,
        sku: null
      };
    }
    /**
     * get info about variant to be sent to tracker
     * @return {Object}
     */

  }, {
    key: "selectedVariantTrackingInfo",
    get: function get() {
      var variant = this.selectedVariant;
      return {
        id: variant.id,
        name: variant.title,
        productId: this.model.id,
        productName: this.model.title,
        quantity: this.selectedQuantity,
        price: variant.priceV2.amount,
        sku: null
      };
    }
    /**
     * get info about product to be sent to tracker
     * @return {Object}
     */

  }, {
    key: "productTrackingInfo",
    get: function get() {
      return {
        id: this.model.id
      };
    }
    /**
     * get configuration object for product details modal based on product config and modalProduct config.
     * @return {Object} configuration object.
     */

  }, {
    key: "modalProductConfig",
    get: function get() {
      var _this12 = this;

      var modalProductStyles;

      if (this.config.product.styles) {
        modalProductStyles = (0, _merge2.default)({}, Object.keys(this.config.product.styles).reduce(function (productStyles, selectorKey) {
          productStyles[selectorKey] = whitelistedProperties(_this12.config.product.styles[selectorKey]);
          return productStyles;
        }, {}), this.config.modalProduct.styles);
      } else {
        modalProductStyles = {};
      }

      return Object.assign({}, this.config.modalProduct, {
        styles: modalProductStyles
      });
    }
    /**
     * get params for online store URL.
     * @return {Object}
     */

  }, {
    key: "onlineStoreParams",
    get: function get() {
      return {
        channel: 'buy_button',
        referrer: encodeURIComponent(_windowUtils.default.location()),
        variant: atob(this.selectedVariant.id).split('/')[4]
      };
    }
    /**
     * get query string for online store URL from params
     * @return {String}
     */

  }, {
    key: "onlineStoreQueryString",
    get: function get() {
      var _this13 = this;

      return Object.keys(this.onlineStoreParams).reduce(function (string, key) {
        return "".concat(string).concat(key, "=").concat(_this13.onlineStoreParams[key], "&");
      }, '?');
    }
    /**
     * get URL to open online store page for product.
     * @return {String}
     */

  }, {
    key: "onlineStoreURL",
    get: function get() {
      return "".concat(this.model.onlineStoreUrl).concat(this.onlineStoreQueryString);
    }
  }, {
    key: "priceAccessibilityLabel",
    get: function get() {
      return this.hasCompareAtPrice ? this.options.text.salePriceAccessibilityLabel : this.options.text.regularPriceAccessibilityLabel;
    }
  }, {
    key: "compareAtPriceAccessibilityLabel",
    get: function get() {
      return this.hasCompareAtPrice ? this.options.text.regularPriceAccessibilityLabel : '';
    }
  }, {
    key: "hasCompareAtPrice",
    get: function get() {
      return Boolean(this.selectedVariant && this.selectedVariant.compareAtPriceV2);
    }
  }]);

  return Product;
}(_component.default);

exports.default = Product;