"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = formatMoney;

var _moneyFormat = _interopRequireDefault(require("../defaults/money-format"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
var thousandsRegex = /(\d)(?=(\d\d\d)+(?!\d))/g;

function formatWithDelimiters(number) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var thousands = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ',';
  var decimal = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '.';

  if (isNaN(number) || number == null) {
    return 0;
  }

  var fixedNumber = (number / 100.0).toFixed(precision);
  var parts = fixedNumber.split('.');
  var dollars = parts[0].replace(thousandsRegex, "$1".concat(thousands));
  var cents = parts[1] ? decimal + parts[1] : '';
  return dollars + cents;
}

function formatMoney(amount, format) {
  var cents = amount * 100;

  if (typeof cents === 'string') {
    cents = cents.replace('.', '');
  }

  var value = '';
  var formatString = format || _moneyFormat.default;
  var placeholderMatch = formatString.match(placeholderRegex);

  if (!placeholderMatch) {
    formatString = _moneyFormat.default;
    placeholderMatch = formatString.match(placeholderRegex);
  }

  switch (placeholderMatch[1]) {
    case 'amount':
      value = formatWithDelimiters(cents);
      break;

    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;

    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;

    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;

    case 'amount_no_decimals_with_space_separator':
      value = formatWithDelimiters(cents, 0, ' ');
      break;

    default:
      value = formatWithDelimiters(cents);
  }

  return formatString.replace(placeholderRegex, value);
}