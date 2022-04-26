"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function normalizeId(type, databaseKey) {
  return btoa("gid://shopify/".concat(type, "/").concat(databaseKey));
}

function getNormalizedIdFromConfig(type, config, databaseKey, storefrontKey) {
  var denormalizedValue = config[databaseKey];
  var normalizedValue = config[storefrontKey];

  if (normalizedValue) {
    return normalizedValue;
  } else if (denormalizedValue) {
    if (Array.isArray(denormalizedValue)) {
      return denormalizedValue.map(function (value) {
        return normalizeId(type, value);
      });
    } else {
      return normalizeId(type, denormalizedValue);
    }
  } else {
    return null;
  }
}

function normalizeConfig(config) {
  var baseResourceType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Product';

  if (config.id || config.storefrontId) {
    config.storefrontId = getNormalizedIdFromConfig(baseResourceType, config, 'id', 'storefrontId');
  }

  if (config.variantId || config.storefrontVariantId) {
    config.storefrontVariantId = getNormalizedIdFromConfig('ProductVariant', config, 'variantId', 'storefrontVariantId');
  }

  return config;
}

var _default = normalizeConfig;
exports.default = _default;