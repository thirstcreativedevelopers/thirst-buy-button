"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addClassToElement = addClassToElement;
exports.removeClassFromElement = removeClassFromElement;

function addClassToElement(className, element) {
  if (!className) {
    return;
  }

  if (element.classList) {
    element.classList.add(className);
  } else {
    var classes = element.className.split(' ');

    if (classes.indexOf(className) > -1) {
      return;
    }

    element.setAttribute('class', "".concat(element.className, " ").concat(className));
  }
}

function removeClassFromElement(className, element) {
  if (!className) {
    return;
  }

  if (element.classList) {
    element.classList.remove(className);
  } else {
    element.setAttribute('class', element.className.replace(className, ''));
  }
}