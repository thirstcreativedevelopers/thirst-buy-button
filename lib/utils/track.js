"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var Tracker =
/*#__PURE__*/
function () {
  function Tracker(lib, clientConfig) {
    this.lib = lib || null;
    this.clientConfig = clientConfig;
  }

  var _proto = Tracker.prototype;

  _proto.trackMethod = function trackMethod(fn, event, properties) {
    var self = this;
    return function () {
      var returnValue = fn.apply(void 0, arguments);

      if (returnValue && returnValue.then) {
        return returnValue.then(function (val) {
          self.callLib(event, properties);
          return val;
        });
      }

      self.callLib(event, properties);
      return returnValue;
    };
  };

  _proto.callLib = function callLib(eventName, properties) {
    switch (eventName) {
      case 'Update Cart':
        if (properties.quantity < 1) {
          return this.track('Removed Product', properties);
        }

        if (properties.prevQuantity && properties.quantity < properties.prevQuantity) {
          return;
        }

        return this.track('Added Product', properties);

      default:
        return this.track(eventName, properties);
    }
  };

  _proto.trackPageview = function trackPageview() {
    if (this.lib && this.lib.page) {
      this.lib.page();
    }
  };

  _proto.trackComponent = function trackComponent(type, properties) {
    switch (type) {
      case 'product':
        return this.track('Viewed Product', properties);

      case 'collection':
        return this.track('Viewed Product Category', properties);
    }
  };

  _proto.track = function track(eventName, properties) {
    properties.pageurl = document.location.href;
    properties.referrer = document.referrer;
    properties.subdomain = this.clientConfig.domain;

    if (this.lib && this.lib.track) {
      this.lib.track(eventName, properties);
    }
  };

  return Tracker;
}();

exports.default = Tracker;