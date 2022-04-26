"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _view = _interopRequireDefault(require("../view"));

var _elementClass = require("../utils/element-class");

var _focus = require("../utils/focus");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var ModalView =
/*#__PURE__*/
function (_View) {
  _inheritsLoose(ModalView, _View);

  function ModalView() {
    return _View.apply(this, arguments) || this;
  }

  var _proto = ModalView.prototype;

  _proto.wrapTemplate = function wrapTemplate(html) {
    return "<div class=\"".concat(this.component.classes.modal.overlay, "\"><div class=\"").concat(this.component.classes.modal.modal, "\">").concat(html, "</div></div>");
  }
  /**
   * close modal.
   */
  ;

  _proto.close = function close() {
    var _this = this;

    this.component.isVisible = false;
    (0, _focus.removeTrapFocus)(this.wrapper);

    if (this.wrapper && this._closeOnBgClick) {
      this.wrapper.removeEventListener('click', this._closeOnBgClick);
    }

    (0, _elementClass.removeClassFromElement)('is-active', this.wrapper);
    (0, _elementClass.removeClassFromElement)('is-active', this.document.body);
    (0, _elementClass.removeClassFromElement)('shopify-buy-modal-is-active', document.body);
    (0, _elementClass.removeClassFromElement)('shopify-buy-modal-is-active', document.getElementsByTagName('html')[0]);

    if (!this.iframe) {
      (0, _elementClass.removeClassFromElement)('is-active', this.component.node);
      (0, _elementClass.removeClassFromElement)('is-block', this.component.node);
      return;
    }

    this.iframe.removeClass('is-block');

    if (this.component.props.browserFeatures.transition) {
      this.iframe.parent.addEventListener('transitionend', function () {
        _this.iframe.removeClass('is-active');
      });
    } else {
      this.iframe.removeClass('is-active');
    }
  }
  /**
   * delegates DOM events to event listeners.
   * Adds event listener to wrapper to close modal on click.
   */
  ;

  _proto.delegateEvents = function delegateEvents() {
    _View.prototype.delegateEvents.call(this);

    this._closeOnBgClick = this.component.closeOnBgClick.bind(this.component);
    this.wrapper.addEventListener('click', this._closeOnBgClick);
  };

  _proto.render = function render() {
    if (!this.component.isVisible) {
      return;
    }

    _View.prototype.render.call(this);

    (0, _elementClass.addClassToElement)('is-active', this.document.body);
    (0, _elementClass.addClassToElement)('shopify-buy-modal-is-active', document.body);
    (0, _elementClass.addClassToElement)('shopify-buy-modal-is-active', document.getElementsByTagName('html')[0]);
    (0, _elementClass.addClassToElement)('is-active', this.wrapper);

    if (this.iframe) {
      this.iframe.addClass('is-active');
      this.iframe.addClass('is-block');
    } else {
      (0, _elementClass.addClassToElement)('is-active', this.component.node);
      (0, _elementClass.addClassToElement)('is-block', this.component.node);
    }
  };

  return ModalView;
}(_view.default);

exports.default = ModalView;