"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _merge = _interopRequireDefault(require("../utils/merge"));

var _component = _interopRequireDefault(require("../component"));

var _product = _interopRequireDefault(require("./product"));

var _modal = _interopRequireDefault(require("../views/modal"));

var _modal2 = _interopRequireDefault(require("../updaters/modal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * Renders product modal.
 * @extends Component.
 */
var Modal =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(Modal, _Component);

  /**
   * create Modal.
   * @param {Object} config - configuration object.
   * @param {Object} props - data and utilities passed down from UI instance.
   */
  function Modal(config, props) {
    var _this;

    _this = _Component.call(this, config, props) || this;
    _this.typeKey = 'modal';
    _this.node = config.node ? config.node.appendChild(document.createElement('div')) : document.body.appendChild(document.createElement('div'));
    _this.node.className = 'shopify-buy-modal-wrapper';
    _this.product = null;
    _this.updater = new _modal2.default(_assertThisInitialized(_this));
    _this.view = new _modal.default(_assertThisInitialized(_this));
    return _this;
  }
  /**
   * get events to be bound to DOM.
   * Combines Product events with modal events.
   * @return {Object}
   */


  var _proto = Modal.prototype;

  _proto.closeOnBgClick = function closeOnBgClick(evt) {
    if (!this.productWrapper.contains(evt.target)) {
      this.props.closeModal();
    }
  }
  /**
   * initializes component by creating model and rendering view.
   * Creates and initializes product component.
   * @param {Object} [data] - data to initialize model with.
   * @return {Promise} promise resolving to instance.
  */
  ;

  _proto.init = function init(data) {
    var _this2 = this;

    this.isVisible = true;
    return _Component.prototype.init.call(this, data).then(function () {
      _this2.productWrapper = _this2.view.wrapper.getElementsByClassName(_this2.classes.modal.modal)[0];
      _this2.product = new _product.default(_this2.productConfig, _this2.props);
      return _this2.product.init(_this2.model).then(function () {
        _this2.view.setFocus();

        return _this2.view.resize();
      });
    });
  }
  /**
   * close modal.
   */
  ;

  _proto.close = function close() {
    this._userEvent('closeModal');

    this.view.close();
  };

  _createClass(Modal, [{
    key: "DOMEvents",
    get: function get() {
      return Object.assign({}, _defineProperty({}, "click ".concat(this.selectors.modal.close), this.props.closeModal.bind(this)), this.options.DOMEvents);
    }
    /**
     * get configuration object for product within modal. Set product node to modal contents.
     * @return {Object}
     */

  }, {
    key: "productConfig",
    get: function get() {
      return Object.assign({}, this.globalConfig, {
        node: this.productWrapper,
        options: (0, _merge.default)({}, this.config),
        modalProduct: true
      });
    }
  }]);

  return Modal;
}(_component.default);

exports.default = Modal;