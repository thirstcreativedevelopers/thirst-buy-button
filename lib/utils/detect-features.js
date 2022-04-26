"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function detectCSSFeature(featurename) {
  var feature = false,
      domPrefixes = 'Webkit Moz ms O'.split(' '),
      elm = document.createElement('div'),
      featurenameCapital = null;
  featurename = featurename.toLowerCase();

  if (elm.style[featurename] !== undefined) {
    feature = true;
  }

  if (feature === false) {
    featurenameCapital = featurename.charAt(0).toUpperCase() + featurename.substr(1);

    for (var i = 0; i < domPrefixes.length; i++) {
      if (elm.style[domPrefixes[i] + featurenameCapital] !== undefined) {
        feature = true;
        break;
      }
    }
  }

  return feature;
}

var supportsAnimations = function supportsAnimations() {
  return detectCSSFeature('animation');
};

var supportsTransitions = function supportsTransitions() {
  return detectCSSFeature('transition');
};

var supportsTransforms = function supportsTransforms() {
  return detectCSSFeature('transform');
};

var supportsWindowOpen = function supportsWindowOpen() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if (userAgent.indexOf('Mac OS X') === -1) {
    return true;
  }

  var unSupportedApps = ['Instagram', 'Pinterest/iOS', 'FBAN/FBIOS', 'FBAN/MessengerForiOS'];
  return !unSupportedApps.some(function (appName) {
    return userAgent.indexOf(appName) > -1;
  });
};

var _default = {
  animation: supportsAnimations(),
  transition: supportsTransitions(),
  transform: supportsTransforms(),
  windowOpen: supportsWindowOpen
};
exports.default = _default;