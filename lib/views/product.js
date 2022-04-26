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

var ProductView =
/*#__PURE__*/
function (_View) {
  _inheritsLoose(ProductView, _View);

  function ProductView() {
    return _View.apply(this, arguments) || this;
  }

  var _proto = ProductView.prototype;

  /**
   * add event listener which triggers resize when the product image is loaded.
   */
  _proto.resizeOnLoad = function resizeOnLoad() {
    var _this = this;

    var productContents = this.component.config.product.contents;

    if (!(productContents.img || productContents.imgWithCarousel)) {
      return;
    }

    var image = this.wrapper.getElementsByClassName(this.component.classes.product.img)[0];

    if (!image) {
      return;
    }

    image.addEventListener('load', function () {
      _this.resize();
    });
  }
  /**
   * renders string template using viewData to wrapper element.
   * Resizes iframe to match image size.
   */
  ;

  _proto.render = function render() {
    _View.prototype.render.call(this);

    this.resizeOnLoad();
  };

  _proto.wrapTemplate = function wrapTemplate(html) {
    var ariaLabel;

    switch (this.component.options.buttonDestination) {
      case 'modal':
        ariaLabel = 'View details';
        break;

      case 'cart':
        ariaLabel = 'Add to cart';
        break;

      default:
        ariaLabel = 'Buy Now';
    }

    if (this.component.isButton) {
      return "<div class=\"".concat(this.wrapperClass, " ").concat(this.component.classes.product.product, "\"><div tabindex=\"0\" role=\"button\" aria-label=\"").concat(ariaLabel, "\" class=\"").concat(this.component.classes.product.blockButton, "\">").concat(html, "</div></div>");
    } else {
      return "<div class=\"".concat(this.wrapperClass, " ").concat(this.component.classes.product.product, "\">").concat(html, "</div>");
    }
  };

  _createClass(ProductView, [{
    key: "className",
    get: function get() {
      return this.component.classes.product[this.component.options.layout];
    }
  }, {
    key: "shouldResizeX",
    get: function get() {
      return false;
    }
  }, {
    key: "shouldResizeY",
    get: function get() {
      return true;
    }
  }, {
    key: "outerHeight",
    get: function get() {
      return "".concat(this.wrapper.clientHeight, "px");
    }
  }, {
    key: "wrapperClass",
    get: function get() {
      return "".concat(this.component.currentImage ? 'has-image' : 'no-image', " ").concat(this.component.classes.product[this.component.options.layout]);
    }
  }]);

  return ProductView;
}(_view.default);

exports.default = ProductView;