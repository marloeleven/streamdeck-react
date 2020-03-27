import { createRequest, getCallback } from 'handlers/AsyncRequest';
import EVENTS from 'const/events';
import { parse } from 'utils/function';

class XSpltHandler {
  constructor() {
    this.callbacks = {};
  }

  onPayload(event, payload) {
    switch (event) {
      case EVENTS.XSPLIT.SET.ACTIVE_SCENE:
      case EVENTS.XSPLIT.GET.ACTIVE_SCENE:
      case EVENTS.XSPLIT.GET.SCENES:
        getCallback(event, payload);
        break;
      case EVENTS.SUBSCRIPTION:
        /*
          {
            event: 'SUBSCRIPTION',
            payload: {
              event: 'ACTIVE_SCENE',
              payload: [] / {}
            }

          }
        */

        this._handleSubscription(parse(payload));
        break;
      default:
        getCallback(event, payload); // fallback
    }
  }

  send() {
    // overridden on utils/connect/XSplitConnect:23
  }

  getActiveScene() {
    const event = EVENTS.XSPLIT.GET.ACTIVE_SCENE;

    this.send({ event });

    return createRequest(event);
  }

  setActiveScene({ id, index }) {
    const event = EVENTS.XSPLIT.SET.ACTIVE_SCENE;

    this.send({ event, payload: { id, index } });

    return createRequest(event);
  }

  getAllScenes() {
    const event = EVENTS.XSPLIT.GET.SCENES;
    this.send({ event });

    return createRequest(event);
  }

  _handleSubscription({ event, payload }) {
    if (this.callbacks.hasOwnProperty(event)) {
      this.callbacks[event](parse(payload));
    }
  }

  on(payload, callback) {
    this.callbacks[payload] = callback;
    this.send({ event: EVENTS.SUBSCRIPTION, payload });
  }
}

export default new XSpltHandler();
