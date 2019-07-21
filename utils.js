const log = console.log.bind(console);

const e = selector => document.querySelector(selector);

const es = selector => document.querySelectorAll(selector);

const bindEvent = (element, eventName, callback) => {
  element.addEventListener(eventName, callback);
};

const bindAll = (elements, eventName, callback) => {
  for (var i = 0; i < elements.length; i++) {
    var e = elements[i];
    bindEvent(e, eventName, callback);
  }
};