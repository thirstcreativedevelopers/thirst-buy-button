"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var stylesTemplate = '{{#selectors}}' + '{{#media}} {{media}} { {{/media}}' + '{{selector}} { ' + '{{#declarations}}' + '{{property}}: {{{value}}};' + '{{/declarations}}' + ' } ' + '{{#media}} } {{/media}}' + '{{/selectors}}';
var _default = stylesTemplate;
exports.default = _default;