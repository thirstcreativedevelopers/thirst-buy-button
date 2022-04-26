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

var pollInterval = 200;

var ProductSetView =
/*#__PURE__*/
function (_View) {
  _inheritsLoose(ProductSetView, _View);

  function ProductSetView(component) {
    var _this;

    _this = _View.call(this, component) || this;
    _this.height = 0;
    _this.resizeCompleted = false;
    return _this;
  }

  var _proto = ProductSetView.prototype;

  _proto.wrapTemplate = function wrapTemplate(html) {
    return "<div class=\"".concat(this.component.classes.productSet.productSet, "\">").concat(html, "</div>");
  }
  /**
   * resize iframe until it is tall enough to contain all products.
   */
  ;

  _proto.resizeUntilFits = function resizeUntilFits() {
    var _this2 = this;

    if (!this.iframe || this.resizeCompleted) {
      return;
    }

    var maxResizes = this.component.products.length;
    var resizes = 0;
    this.height = this.outerHeight;
    this.resize();
    var productSetResize = setInterval(function () {
      var currentHeight = _this2.outerHeight;

      if (parseInt(currentHeight, 10) > parseInt(_this2.height, 10)) {
        resizes++;
        _this2.height = currentHeight;

        _this2.resize(currentHeight);
      }

      if (resizes > maxResizes) {
        _this2.resizeCompleted = true;
        clearInterval(productSetResize);
      }
    }, pollInterval);
  };

  _createClass(ProductSetView, [{
    key: "shouldResizeY",
    get: function get() {
      return true;
    }
  }]);

  return ProductSetView;
}(_view.default);

exports.default = ProductSetView;