"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _merge = _interopRequireDefault(require("./utils/merge"));

var _isFunction = _interopRequireDefault(require("./utils/is-function"));

var _components = _interopRequireDefault(require("./defaults/components"));

var _logNotFound = _interopRequireDefault(require("./utils/log-not-found"));

var _logger = _interopRequireDefault(require("./utils/logger"));

var _moneyFormat = _interopRequireDefault(require("./defaults/money-format"));

var _view = _interopRequireDefault(require("./view"));

var _updater = _interopRequireDefault(require("./updater"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function moneyFormat() {
  var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _moneyFormat.default;
  return decodeURIComponent(format);
}
/**
 * Manages rendering, lifecycle, and data fetching of a cmoponent.
 */


var Component =
/*#__PURE__*/
function () {
  /**
   * creates a component.
   * @param {Object} config - configuration object.
   * @param {Object} props - data and utilities passed down from UI instance.
   */
  function Component(config, props) {
    this.id = config.id;
    this.storefrontId = config.storefrontId;
    this.handle = config.handle;
    this.node = config.node;
    this.globalConfig = {
      debug: config.debug,
      moneyFormat: moneyFormat(config.moneyFormat),
      cartNode: config.cartNode,
      modalNode: config.modalNode,
      toggles: config.toggles
    };
    this.config = (0, _merge.default)({}, _components.default, config.options || {});
    this.props = props;
    this.model = {};
    this.updater = new _updater.default(this);
    this.view = new _view.default(this);
  }
  /**
   * get unique name for component.
   * @return {String} component name.
   */


  var _proto = Component.prototype;

  /**
   * initializes component by creating model and rendering view.
   * @param {Object} [data] - data to initialize model with.
   * @return {Promise} promise resolving to instance.
   */
  _proto.init = function init(data) {
    var _this = this;

    this._userEvent('beforeInit');

    return this.view.init().then(function () {
      return _this.setupModel(data);
    }).then(function (model) {
      _this.model = model;

      _this.view.render();

      _this.view.delegateEvents();

      _this._userEvent('afterInit');

      return _this;
    }).catch(function (err) {
      if (err.message.indexOf('Not Found') > -1) {
        (0, _logNotFound.default)(_this);
      }

      throw err;
    });
  }
  /**
   * fetches data if necessary
   * @param {Object} [data] - data to initialize model with.
   */
  ;

  _proto.setupModel = function setupModel(data) {
    if (data) {
      return Promise.resolve(data);
    } else {
      return this.fetchData();
    }
  }
  /**
   * re-assign configuration and re-render component.
   * @param {Object} config - new configuration object.
   */
  ;

  _proto.updateConfig = function updateConfig(config) {
    return this.updater.updateConfig(config);
  }
  /**
   * remove node from DOM.
   */
  ;

  _proto.destroy = function destroy() {
    this.view.destroy();
  };

  _proto._userEvent = function _userEvent(methodName) {
    if (this.globalConfig.debug) {
      _logger.default.info("EVENT: ".concat(methodName, " (").concat(this.typeKey, ")"));
    }

    if ((0, _isFunction.default)(this.events[methodName])) {
      this.events[methodName].call(this, this);
    }
  };

  _createClass(Component, [{
    key: "name",
    get: function get() {
      var uniqueHandle = '';

      if (this.id) {
        uniqueHandle = "-".concat(this.id);
      } else if (this.handle) {
        uniqueHandle = "-".concat(this.handle);
      }

      return "frame-".concat(this.typeKey).concat(uniqueHandle);
    }
    /**
     * get configuration options specific to this component.
     * @return {Object} options object.
     */

  }, {
    key: "options",
    get: function get() {
      return (0, _merge.default)({}, this.config[this.typeKey]);
    }
    /**
     * get events to be bound to DOM.
     * @return {Object} DOMEvents object.
     */

  }, {
    key: "DOMEvents",
    get: function get() {
      return this.options.DOMEvents || {};
    }
    /**
     * get events to be called on lifecycle methods.
     * @return {Object} events object.
     */

  }, {
    key: "events",
    get: function get() {
      return this.options.events || {};
    }
    /**
     * get classes for component and any components it contains as determined by manifest.
     * @return {Object} class keys and names.
     */

  }, {
    key: "classes",
    get: function get() {
      var _this2 = this;

      return this.options.manifest.filter(function (component) {
        return _this2.config[component].classes;
      }).reduce(function (hash, component) {
        hash[component] = _this2.config[component].classes;
        return hash;
      }, {});
    }
    /**
     * get classes formatted as CSS selectors.
     * @return {Object} class keys and selectors.
     */

  }, {
    key: "selectors",
    get: function get() {
      var _this3 = this;

      return this.options.manifest.filter(function (component) {
        return _this3.config[component].classes;
      }).reduce(function (hash, component) {
        hash[component] = Object.keys(_this3.config[component].classes).reduce(function (classes, classKey) {
          classes[classKey] = ".".concat(_this3.classes[component][classKey].split(' ').join('.'));
          return classes;
        }, {});
        return hash;
      }, {});
    }
    /**
     * get styles for component and any components it contains as determined by manifest.
     * @return {Object} key-value pairs of CSS styles.
     */

  }, {
    key: "styles",
    get: function get() {
      var _this4 = this;

      return this.options.manifest.filter(function (component) {
        return _this4.config[component].styles;
      }).reduce(function (hash, component) {
        hash[component] = _this4.config[component].styles;
        return hash;
      }, {});
    }
    /**
     * get google fonts for component and any components it contains as determined by manifest.
     * @return {Array} array of names of fonts to be loaded.
     */

  }, {
    key: "googleFonts",
    get: function get() {
      var _this5 = this;

      return this.options.manifest.filter(function (component) {
        return _this5.config[component].googleFonts;
      }).reduce(function (fonts, component) {
        return fonts.concat(_this5.config[component].googleFonts);
      }, []);
    }
    /**
     * get data to be passed to view.
     * @return {Object} viewData object.
     */

  }, {
    key: "viewData",
    get: function get() {
      return (0, _merge.default)(this.model, this.options.viewData, {
        classes: this.classes,
        text: this.options.text
      });
    }
    /**
     * get callbacks for morphdom lifecycle events.
     * @return {Object} object.
     */

  }, {
    key: "morphCallbacks",
    get: function get() {
      return {
        onBeforeElUpdated: function onBeforeElUpdated(fromEl, toEl) {
          if (fromEl.tagName === 'IMG') {
            if (fromEl.src === toEl.getAttribute('data-src')) {
              return false;
            }
          }

          return true;
        }
      };
    }
  }]);

  return Component;
}();

exports.default = Component;