"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mustache = _interopRequireDefault(require("mustache"));

var _styles = _interopRequireDefault(require("./templates/styles"));

var _conditional = _interopRequireDefault(require("./styles/embeds/conditional"));

var _elementClass = require("./utils/element-class");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var iframeStyles = {
  width: '100%',
  overflow: 'hidden',
  border: 'none'
};
var iframeAttrs = {
  horizontalscrolling: 'no',
  verticalscrolling: 'no',
  allowTransparency: 'true',
  frameBorder: '0',
  scrolling: 'no'
};
var webfontScript = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.16/webfont.js';

function isPseudoSelector(key) {
  return key.charAt(0) === ':';
}

function isMedia(key) {
  return key.charAt(0) === '@';
}

function isValue(test) {
  return typeof test === 'string' || typeof test === 'number';
}

function ruleDeclarations(rule) {
  return Object.keys(rule).filter(function (key) {
    return isValue(rule[key]);
  }).map(function (key) {
    return {
      property: key,
      value: rule[key]
    };
  });
}

function selectorStyleGroup(selector, selectorClass, classes) {
  var styleGroup = [];

  if (selector && selectorClass) {
    var formattedSelector = selectorClass.split(' ').join('.');

    if (!isPseudoSelector(formattedSelector)) {
      formattedSelector = ".".concat(formattedSelector);
    }

    styleGroup = Object.keys(selector).filter(function (decKey) {
      return !isValue(selector[decKey]);
    }).reduce(function (acc, decKey) {
      var className = classes[decKey] || decKey;
      return acc.concat(selectorStyleGroup(selector[decKey], className, classes).map(function (group) {
        var groupSelector = '';

        if (isPseudoSelector(group.selector)) {
          groupSelector = "".concat(formattedSelector).concat(group.selector);
        } else if (isMedia(decKey)) {
          groupSelector = formattedSelector;
        } else {
          groupSelector = "".concat(formattedSelector, " ").concat(group.selector);
        }

        return {
          selector: groupSelector,
          declarations: group.declarations,
          media: isMedia(decKey) ? decKey : null
        };
      }));
    }, []);
    var declarations = ruleDeclarations(selector);

    if (declarations.length) {
      styleGroup.push({
        selector: "".concat(formattedSelector),
        declarations: declarations
      });
    }
  }

  return styleGroup;
}

var iframe =
/*#__PURE__*/
function () {
  function iframe(node, config) {
    var _this = this;

    this.el = document.createElement('iframe');
    this.parent = node;
    this.stylesheet = config.stylesheet;
    this.customStylesHash = config.customStyles || {};
    this.classes = config.classes;
    this.browserFeatures = config.browserFeatures;
    this.googleFonts = config.googleFonts || [];
    this.name = config.name;

    if (config.width) {
      this.setWidth(config.width);
    }

    Object.keys(iframeStyles).forEach(function (key) {
      _this.el.style[key] = iframeStyles[key];
    });
    Object.keys(iframeAttrs).forEach(function (key) {
      return _this.el.setAttribute(key, iframeAttrs[key]);
    });
    this.el.setAttribute('name', config.name);
    this.styleTag = null;
  }

  var _proto = iframe.prototype;

  _proto.load = function load() {
    var _this2 = this;

    return new Promise(function (resolve) {
      _this2.el.onload = function () {
        return _this2.loadFonts().then(function () {
          _this2.appendStyleTag();

          return resolve();
        });
      };

      _this2.parent.appendChild(_this2.el);
    });
  };

  _proto.loadFonts = function loadFonts() {
    var _this3 = this;

    if (!this.googleFonts || !this.googleFonts.length) {
      return Promise.resolve(true);
    }

    return this.loadFontScript().then(function () {
      return new Promise(function (resolve) {
        if (!window.WebFont) {
          return resolve();
        }

        window.WebFont.load({
          google: {
            families: _this3.googleFonts
          },
          fontactive: function fontactive() {
            return resolve();
          },
          context: _this3.el.contentWindow || frames[_this3.name]
        });
        return window.setTimeout(function () {
          return resolve();
        }, 1000);
      });
    });
  };

  _proto.loadFontScript = function loadFontScript() {
    if (window.WebFont) {
      return Promise.resolve();
    }

    var fontScript = document.createElement('script');
    return new Promise(function (resolve) {
      fontScript.onload = function () {
        resolve();
      };

      fontScript.src = webfontScript;
      document.head.appendChild(fontScript);
      setTimeout(function () {
        resolve();
      }, 500);
    });
  };

  _proto.setWidth = function setWidth(width) {
    this.parent.style['max-width'] = width;
  };

  _proto.addClass = function addClass(className) {
    (0, _elementClass.addClassToElement)(className, this.parent);
  };

  _proto.removeClass = function removeClass(className) {
    (0, _elementClass.removeClassFromElement)(className, this.parent);
  };

  _proto.setName = function setName(name) {
    this.el.setAttribute('name', name);
  };

  _proto.updateStyles = function updateStyles(customStyles, googleFonts) {
    var _this4 = this;

    this.googleFonts = googleFonts;
    return this.loadFonts().then(function () {
      _this4.customStylesHash = customStyles;
      _this4.styleTag.innerHTML = _this4.css;
      return;
    });
  };

  _proto.appendStyleTag = function appendStyleTag() {
    if (!this.document.head) {
      return;
    }

    this.styleTag = this.document.createElement('style');

    if (this.styleTag.styleSheet) {
      this.styleTag.styleSheet.cssText = this.css;
    } else {
      this.styleTag.appendChild(this.document.createTextNode(this.css));
    }

    this.document.head.appendChild(this.styleTag);
  };

  _createClass(iframe, [{
    key: "width",
    get: function get() {
      return this.parent.style['max-width'];
    }
  }, {
    key: "document",
    get: function get() {
      var doc;

      if (this.el.contentWindow && this.el.contentWindow.document.body) {
        doc = this.el.contentWindow.document;
      } else if (this.el.document && this.el.document.body) {
        doc = this.el.document;
      } else if (this.el.contentDocument && this.el.contentDocument.body) {
        doc = this.el.contentDocument;
      }

      return doc;
    }
  }, {
    key: "customStyles",
    get: function get() {
      var _this5 = this;

      var customStyles = [];
      Object.keys(this.customStylesHash).forEach(function (typeKey) {
        if (_this5.customStylesHash[typeKey]) {
          Object.keys(_this5.customStylesHash[typeKey]).forEach(function (key) {
            var styleGroup = selectorStyleGroup(_this5.customStylesHash[typeKey][key], _this5.classes[typeKey][key], _this5.classes[typeKey]);
            customStyles = customStyles.concat(styleGroup);
          });
        }
      });
      return customStyles;
    }
  }, {
    key: "conditionalCSS",
    get: function get() {
      if (this.browserFeatures.transition && this.browserFeatures.transform && this.browserFeatures.animation) {
        return '';
      }

      return _conditional.default;
    }
  }, {
    key: "css",
    get: function get() {
      var compiled = _mustache.default.render(_styles.default, {
        selectors: this.customStyles
      });

      return "".concat(this.stylesheet, " \n ").concat(compiled, " \n ").concat(this.conditionalCSS);
    }
  }]);

  return iframe;
}();

exports.default = iframe;