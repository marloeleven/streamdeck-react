import { Observable } from 'rxjs';

import { SETTINGS } from 'const/observable';
import { getCallbacks } from './registerCallback';

import MessageHandler from 'handlers/MessageHandler';

import EVENTS from 'const/events';

export default handler => {
  console.warn(handler);
  const observable = new Observable(subscriber => {
    handler.on(EVENTS.RECEIVE.SETTINGS, settings => {
      console.warn('conceived value', settings);
      subscriber.next(settings);
    });
  });

  observable.subscribe({
    next(settings) {
      console.warn('went here with value', settings);
      const callbacks = getCallbacks(SETTINGS);
      for (const callback in callbacks) {
        callback(settings);
      }
    },
    error(error) {
      MessageHandler.error(error);
    },
    complete() {
      MessageHandler.log('Settings observable completed');
    },
  });
};
