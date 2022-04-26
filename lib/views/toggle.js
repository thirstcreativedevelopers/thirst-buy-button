"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _view = _interopRequireDefault(require("../view"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var ENTER_KEY = 13;
var SPACE_KEY = 32;

var ToggleView =
/*#__PURE__*/
function (_View) {
  _inheritsLoose(ToggleView, _View);

  function ToggleView() {
    return _View.apply(this, arguments) || this;
  }

  var _proto = ToggleView.prototype;

  _proto.render = function render() {
    _View.prototype.render.call(this);

    if (this.component.options.sticky) {
      this.addClass('is-sticky');
    }

    if (this.isVisible) {
      this.addClass('is-active');
    } else {
      this.removeClass('is-active');
    }

    if (this.iframe) {
      this.iframe.parent.setAttribute('tabindex', 0);
      this.iframe.parent.setAttribute('role', 'button');
      this.iframe.parent.setAttribute('aria-label', this.component.options.text.title);
      this.resize();
    }
  };

  _proto.delegateEvents = function delegateEvents() {
    var _this = this;

    _View.prototype.delegateEvents.call(this);

    if (!this.iframe) {
      return;
    }

    this.iframe.parent.addEventListener('keydown', function (evt) {
      if (evt.keyCode !== ENTER_KEY && evt.keyCode !== SPACE_KEY) {
        return;
      }

      evt.preventDefault();

      _this.component.props.setActiveEl(_this.node);

      _this.component.props.cart.toggleVisibility(_this.component.props.cart);
    });
  };

  _proto.wrapTemplate = function wrapTemplate(html) {
    return "<div class=\"".concat(this.stickyClass, " ").concat(this.component.classes.toggle.toggle, "\">\n      ").concat(html, "\n      ").concat(this.readableLabel, "\n    </div>");
  };

  _proto._resizeX = function _resizeX() {
    this.iframe.el.style.width = "".concat(this.wrapper.clientWidth, "px");
  };

  _createClass(ToggleView, [{
    key: "shouldResizeY",
    get: function get() {
      return true;
    }
  }, {
    key: "shouldResizeX",
    get: function get() {
      return true;
    }
  }, {
    key: "isVisible",
    get: function get() {
      return this.component.count > 0;
    }
  }, {
    key: "stickyClass",
    get: function get() {
      return this.component.options.sticky ? 'is-sticky' : 'is-inline';
    }
  }, {
    key: "outerHeight",
    get: function get() {
      return "".concat(this.wrapper.clientHeight, "px");
    }
  }, {
    key: "readableLabel",
    get: function get() {
      if (this.component.options.contents.title) {
        return '';
      }

      return "<p class=\"shopify-buy--visually-hidden\">".concat(this.component.options.text.title, "</p>");
    }
  }]);

  return ToggleView;
}(_view.default);

exports.default = ToggleView;