import * as callbackNames from 'const/observable';

export const callbacks = Object.values(callbackNames).reduce((obj, key) => {
  obj[key] = [];
  return obj;
}, {});

export const getCallbacks = callbackName => {
  if (callbacks.hasOwnProperty(callbackName)) {
    return callbacks[callbackName];
  }

  throw new Error(`Unknown event name: ${callbackName}`);
};

export default (callbackName, callback) => {
  if (callbacks.hasOwnProperty(callbackName)) {
    callbacks[callbackName].push(callback);
    return;
  }

  throw new Error(`Unknown event name: ${callbackName}`);
};
