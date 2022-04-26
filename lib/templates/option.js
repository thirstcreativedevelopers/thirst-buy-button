"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var optionTemplates = {
  option: "<div class=\"{{data.classes.option.option}}\" data-element=\"option.option\">\n    <label for=\"{{data.selectId}}\" class=\"{{data.classes.option.label}} {{#data.onlyOption}}{{data.classes.option.hiddenLabel}}{{/data.onlyOption}}\" data-element=\"option.label\">{{data.name}}</label>\n      <div class=\"{{data.classes.option.wrapper}}\" data-element=\"option.wrapper\">\n      <select id=\"{{data.selectId}}\" class=\"{{data.classes.option.select}}\" name=\"{{data.name}}\" data-element=\"option.select\">\n        {{#data.values}}\n          <option {{#selected}}selected{{/selected}} value=\"{{name}}\">{{name}}</option>\n        {{/data.values}}\n      </select>\n      <svg class=\"{{data.classes.option.selectIcon}}\" data-element=\"option.selectIcon\" viewBox=\"0 0 24 24\"><path d=\"M21 5.176l-9.086 9.353L3 5.176.686 7.647 12 19.382 23.314 7.647 21 5.176z\"></path></svg>\n    </div>\n  </div>"
};
var _default = optionTemplates;
exports.default = _default;