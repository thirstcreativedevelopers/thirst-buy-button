"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mustache = _interopRequireDefault(require("mustache"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Template =
/*#__PURE__*/
function () {
  function Template(templates, contents, order) {
    this.templates = templates;
    this.contents = contents;
    this.order = order;
  }

  var _proto = Template.prototype;

  _proto.render = function render(data, cb) {
    var output = _mustache.default.render(this.masterTemplate, data);

    if (!cb) {
      return output;
    }

    return cb(output);
  };

  _createClass(Template, [{
    key: "masterTemplate",
    get: function get() {
      var _this = this;

      return this.order.reduce(function (acc, key) {
        var string = '';

        if (_this.contents[key]) {
          string = _this.templates[key] || '';
        }

        return acc + string;
      }, '');
    }
  }]);

  return Template;
}();

exports.default = Template;