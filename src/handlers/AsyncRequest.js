const callbacks = {};

const ASYNC_TIMEOUT = 5000;

export const getCallback = (eventName, payload) => {
  if (callbacks.hasOwnProperty(eventName)) {
    const { callback } = callbacks[eventName];

    return callback(payload);
  }

  return false;
};

// used
export const createRequest = eventName => {
  return new Promise((resolve, reject) => {
    const asyncTimeout = setTimeout(() => {
      delete callbacks[eventName];
      reject("No response received");
    }, ASYNC_TIMEOUT);

    callbacks[eventName] = {
      callback: asyncResponse => {
        resolve(asyncResponse);
        delete callbacks[eventName];
      },
      clean: () => {
        clearTimeout(asyncTimeout);
        delete callbacks[eventName];
      }
    };
  });
};
