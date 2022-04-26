"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeTrapFocus = removeTrapFocus;
exports.trapFocus = trapFocus;
var TAB_KEY = 9;
var trapFocusHandlers = {};

function removeTrapFocus(container) {
  if (trapFocusHandlers.focusin) {
    container.removeEventListener("focusin", trapFocusHandlers.focusin);
  }

  if (trapFocusHandlers.focusout) {
    container.removeEventListener("focusout", trapFocusHandlers.focusout);
  }

  if (trapFocusHandlers.keydown) {
    container.removeEventListener("keydown", trapFocusHandlers.keydown);
  }
}

function trapFocus(container) {
  var focusableElements = container.querySelectorAll("a, button:enabled, input:enabled, select:enabled");
  var firstElement = focusableElements[0];
  var lastElement = focusableElements[focusableElements.length - 1];
  removeTrapFocus(container);

  trapFocusHandlers.focusin = function (event) {
    if (event.target !== firstElement && event.target !== lastElement) {
      return;
    }

    container.addEventListener("keydown", trapFocusHandlers.keydown);
  };

  trapFocusHandlers.focusout = function () {
    container.removeEventListener("keydown", trapFocusHandlers.keydown);
  };

  trapFocusHandlers.keydown = function (event) {
    if (event.keyCode !== TAB_KEY) {
      return;
    }

    if (event.target === lastElement && !event.shiftKey) {
      event.preventDefault();
      firstElement.focus();
    }

    if (event.target === firstElement && event.shiftKey) {
      event.preventDefault();
      lastElement.focus();
    }
  };

  container.addEventListener("focusout", trapFocusHandlers.focusout);
  container.addEventListener("focusin", trapFocusHandlers.focusin);
  firstElement.focus();
}