import { Observable } from 'rxjs';

import { GLOBAL_SETTINGS } from 'const/observable';
import EVENTS from 'const/events';

import MessageHandler from 'handlers/MessageHandler';

import { getCallbacks } from './registerCallback';

export default handler => {
  const observable = new Observable(subscriber => {
    handler.on(EVENTS.RECEIVE.GLOBAL_SETTINGS, subscriber.next);
  });

  observable.subscribe({
    next(settings) {
      const callbacks = getCallbacks(GLOBAL_SETTINGS);
      for (const callback in callbacks) {
        callback(settings);
      }
    },
    error(error) {
      MessageHandler.error(error);
    },
    complete() {
      MessageHandler.log('Global Settings observable completed');
    },
  });
};
