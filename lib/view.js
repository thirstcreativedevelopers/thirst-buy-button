"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _morphdom = _interopRequireDefault(require("morphdom"));

var _template = _interopRequireDefault(require("./template"));

var _iframe = _interopRequireDefault(require("./iframe"));

var _all = _interopRequireDefault(require("./styles/embeds/all"));

var _elementClass = require("./utils/element-class");

var _focus = require("./utils/focus");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var delegateEventSplitter = /^(\S+)\s*(.*)$/;
var ESC_KEY = 27;

var View =
/*#__PURE__*/
function () {
  function View(component) {
    this.component = component;
    this.iframe = null;
    this.node = this.component.node;
    this.template = new _template.default(this.component.options.templates, this.component.options.contents, this.component.options.order);
    this.eventsBound = false;
  }

  var _proto = View.prototype;

  _proto.init = function init() {
    this.component.node.className += " shopify-buy-frame shopify-buy-frame--".concat(this.component.typeKey);

    if (this.iframe || !this.component.options.iframe) {
      return Promise.resolve(this.iframe);
    }

    this.iframe = new _iframe.default(this.component.node, {
      classes: this.component.classes,
      customStyles: this.component.styles,
      stylesheet: _all.default[this.component.typeKey],
      browserFeatures: this.component.props.browserFeatures,
      googleFonts: this.component.googleFonts,
      name: this.component.name,
      width: this.component.options.layout === 'vertical' ? this.component.options.width : null
    });
    this.iframe.addClass(this.className);
    return this.iframe.load();
  }
  /**
   * renders string template using viewData to wrapper element.
   */
  ;

  _proto.render = function render() {
    var _this = this;

    this.component._userEvent('beforeRender');

    var html = this.template.render({
      data: this.component.viewData
    }, function (data) {
      return _this.wrapTemplate(data);
    });

    if (!this.wrapper) {
      this.wrapper = this._createWrapper();
    }

    this.updateNode(this.wrapper, html);
    this.resize();

    this.component._userEvent('afterRender');
  }
  /**
   * delegates DOM events to event listeners.
   */
  ;

  _proto.delegateEvents = function delegateEvents() {
    var _this2 = this;

    if (this.eventsBound) {
      return;
    }

    this.closeComponentsOnEsc();
    Object.keys(this.component.DOMEvents).forEach(function (key) {
      var _key$match = key.match(delegateEventSplitter),
          _key$match2 = _slicedToArray(_key$match, 3),
          eventName = _key$match2[1],
          selectorString = _key$match2[2];

      if (selectorString) {
        _this2._on(eventName, selectorString, function (evt, target) {
          _this2.component.DOMEvents[key].call(_this2, evt, target);
        });
      } else {
        _this2.wrapper.addEventListener('click', function (evt) {
          _this2.component.DOMEvents[key].call(_this2, evt);
        });
      }
    });

    if (this.iframe) {
      this.iframe.el.onload = function () {
        _this2.iframe.el.onload = null;

        _this2.reloadIframe();
      };
    }

    this.eventsBound = true;
  };

  _proto.reloadIframe = function reloadIframe() {
    this.node.removeChild(this.iframe.el);
    this.wrapper = null;
    this.iframe = null;
    this.component.init();
  };

  _proto.append = function append(wrapper) {
    if (this.iframe) {
      this.document.body.appendChild(wrapper);
    } else {
      this.component.node.appendChild(wrapper);
    }
  };

  _proto.addClass = function addClass(className) {
    if (this.iframe) {
      this.iframe.addClass(className);
    } else {
      (0, _elementClass.addClassToElement)(className, this.component.node);
    }
  };

  _proto.removeClass = function removeClass(className) {
    if (this.iframe) {
      this.iframe.removeClass(className);
    } else {
      (0, _elementClass.removeClassFromElement)(className, this.component.node);
    }
  };

  _proto.destroy = function destroy() {
    this.node.parentNode.removeChild(this.node);
  }
  /**
   * update the contents of a DOM node with template
   * @param {String} className - class name to select node.
   * @param {Object} template - template to be rendered.
   */
  ;

  _proto.renderChild = function renderChild(className, template) {
    var selector = ".".concat(className.split(' ').join('.'));
    var node = this.wrapper.querySelector(selector);
    var html = template.render({
      data: this.component.viewData
    });
    this.updateNode(node, html);
  }
  /**
   * call morpdom on a node with new HTML
   * @param {Object} node - DOM node to be updated.
   * @param {String} html - HTML to update DOM node with.
   */
  ;

  _proto.updateNode = function updateNode(node, html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    (0, _morphdom.default)(node, div.firstElementChild);
  }
  /**
   * wrap HTML string in containing elements.
   * May be defined in subclass.
   * @param {String} html - HTML string.
   * @return {String} wrapped string.
   */
  ;

  _proto.wrapTemplate = function wrapTemplate(html) {
    return "<div class=\"".concat(this.component.classes[this.component.typeKey][this.component.typeKey], "\">").concat(html, "</div>");
  }
  /**
   * resize iframe if necessary.
   */
  ;

  _proto.resize = function resize() {
    if (!this.iframe || !this.wrapper) {
      return;
    }

    if (this.shouldResizeX) {
      this._resizeX();
    }

    if (this.shouldResizeY) {
      this._resizeY();
    }
  }
  /**
   * get total height of iframe contents
   * @return {String} value in pixels.
   */
  ;

  /**
   * Trap focus in the wrapper.
   */
  _proto.setFocus = function setFocus() {
    (0, _focus.trapFocus)(this.wrapper);
  }
  /**
   * determines if iframe will require horizontal resizing to contain its children.
   * May be defined in subclass.
   * @return {Boolean}
   */
  ;

  _proto.closeComponentsOnEsc = function closeComponentsOnEsc() {
    var _this3 = this;

    if (!this.iframe) {
      return;
    }

    this.document.addEventListener('keydown', function (evt) {
      if (evt.keyCode !== ESC_KEY) {
        return;
      }

      _this3.component.props.closeModal();

      _this3.component.props.closeCart();
    });
  };

  _proto.animateRemoveNode = function animateRemoveNode(id) {
    var _this4 = this;

    var el = this.document.getElementById(id);
    (0, _elementClass.addClassToElement)('is-hidden', el);

    if (this.component.props.browserFeatures.animation) {
      el.addEventListener('animationend', function () {
        if (!el.parentNode) {
          return;
        }

        _this4.removeNode(el);
      });
    } else {
      this.removeNode(el);
    }
  };

  _proto.removeNode = function removeNode(el) {
    el.parentNode.removeChild(el);
    this.render();
  };

  _proto._createWrapper = function _createWrapper() {
    var wrapper = document.createElement('div');
    wrapper.className = this.component.classes[this.component.typeKey][this.component.typeKey];
    this.append(wrapper);
    return wrapper;
  };

  _proto._resizeX = function _resizeX() {
    this.iframe.el.style.width = "".concat(this.document.body.clientWidth, "px");
  };

  _proto._resizeY = function _resizeY(value) {
    var newHeight = value || this.outerHeight;
    this.iframe.el.style.height = newHeight;
  };

  _proto._on = function _on(eventName, selector, fn) {
    var _this5 = this;

    this.wrapper.addEventListener(eventName, function (evt) {
      var possibleTargets = Array.prototype.slice.call(_this5.wrapper.querySelectorAll(selector));
      var target = evt.target;
      possibleTargets.forEach(function (possibleTarget) {
        var el = target;

        while (el && el !== _this5.wrapper) {
          if (el === possibleTarget) {
            return fn.call(possibleTarget, evt, possibleTarget);
          }

          el = el.parentNode;
        }

        return el;
      });
    }, eventName === 'blur');
  };

  _createClass(View, [{
    key: "outerHeight",
    get: function get() {
      var style = window.getComputedStyle(this.wrapper, '');

      if (!style) {
        return "".concat(this.wrapper.clientHeight, "px");
      }

      var height = style.getPropertyValue('height');

      if (!height || height === '0px' || height === 'auto') {
        var clientHeight = this.wrapper.clientHeight;
        height = style.getPropertyValue('height') || "".concat(clientHeight, "px");
      }

      return height;
    }
  }, {
    key: "className",
    get: function get() {
      return '';
    }
  }, {
    key: "shouldResizeX",
    get: function get() {
      return false;
    }
    /**
     * determines if iframe will require vertical resizing to contain its children.
     * May be defined in subclass.
     * @return {Boolean}
     */

  }, {
    key: "shouldResizeY",
    get: function get() {
      return false;
    }
    /**
     * get reference to document object.
     * @return {Objcet} instance of Document.
     */

  }, {
    key: "document",
    get: function get() {
      return this.iframe ? this.iframe.document : window.document;
    }
  }]);

  return View;
}();

exports.default = View;