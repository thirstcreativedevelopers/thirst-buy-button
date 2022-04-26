"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _merge = _interopRequireDefault(require("./utils/merge"));

var _template = _interopRequireDefault(require("./template"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Updater =
/*#__PURE__*/
function () {
  function Updater(component) {
    this.component = component;
  }

  var _proto = Updater.prototype;

  _proto.updateConfig = function updateConfig(config) {
    this.component.config = (0, _merge.default)(this.component.config, config.options);
    this.component.view.template = new _template.default(this.component.options.templates, this.component.options.contents, this.component.options.order);

    if (this.component.view.iframe) {
      this.component.view.iframe.updateStyles(this.component.styles, this.component.googleFonts);
    }

    this.component.view.render();
    this.component.view.resize();
  };

  return Updater;
}();

exports.default = Updater;