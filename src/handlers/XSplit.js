import { createRequest, xsplitRequest, getCallback } from 'handlers/AsyncRequest';
import EVENTS from 'const/events';
import { parse } from 'utils/function';

class XSpltHandler {
  constructor() {
    this.callbacks = {};
  }

  onPayload(event, payload) {
    console.warn('RECEIVED', event, payload);
    switch (event) {
      case EVENTS.XSPLIT.SET.ACTIVE_SCENE:
      case EVENTS.XSPLIT.GET.SCENE.ACTIVE:
      case EVENTS.XSPLIT.GET.SCENE.ALL:
      case EVENTS.XSPLIT.GET.SOURCE.STATE:
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

  /* SCENE */
  getActiveScene() {
    const event = EVENTS.XSPLIT.GET.SCENE.ACTIVE;

    this.send({ event });

    return createRequest(event);
  }

  setActiveScene({ id }) {
    const event = EVENTS.XSPLIT.SET.ACTIVE_SCENE;

    this.send({ event, payload: { id } });

    return xsplitRequest(event);
  }

  getAllScenes() {
    const event = EVENTS.XSPLIT.GET.SCENE.ALL;
    this.send({ event });

    return createRequest(event);
  }

  /* SOURCE */
  getSceneSources(sceneId) {
    const event = EVENTS.XSPLIT.GET.SOURCE.ALL;
    this.send({ event, payload: { sceneId } });

    return createRequest(event);
  }

  // not used, replaced by toggleSourceState
  setSourceState(payload) {
    const event = EVENTS.XSPLIT.SET.SOURCE_STATE;

    this.send({ event, payload });

    return xsplitRequest(event);
  }

  toggleSourceState(payload) {
    const event = EVENTS.XSPLIT.TOGGLE.SOURCE_STATE;

    this.send({ event, payload });

    return xsplitRequest(event);
  }

  getSourceState(sceneId, sourceId) {
    const event = EVENTS.XSPLIT.GET.SOURCE.STATE;
    this.send({ event, payload: { sceneId, sourceId } });

    return createRequest(event);
  }

  /* RECORDING */
  toggleRecordingState() {
    const event = EVENTS.XSPLIT.TOGGLE.RECORD_STATE;

    this.send({ event, payload: {} });

    return xsplitRequest(event);
  }

  getRecordingState() {
    const event = EVENTS.XSPLIT.GET.RECORDING.STATE;
    this.send({ event, payload: {} });

    return createRequest(event);
  }

  _handleSubscription({ event, payload }) {
    if (this.callbacks.hasOwnProperty(event)) {
      this.callbacks[event](parse(payload));
    }
  }

  on(event, callback) {
    const eventExist = this.callbacks.hasOwnProperty(event);

    this.callbacks[event] = callback;

    // this is to minimize subscription calls every re-render
    if (!eventExist) {
      this.send({ event: EVENTS.SUBSCRIPTION, payload: event });
    }
  }
}

export default new XSpltHandler();
