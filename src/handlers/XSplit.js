import { xsplitRequest, getCallback } from 'handlers/AsyncRequest';
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
      case EVENTS.XSPLIT.DO.SCREENSHOT:
      case EVENTS.XSPLIT.GET.MICROPHONE.STATE:
      case EVENTS.XSPLIT.GET.SPEAKER.STATE:
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

    return xsplitRequest(event);
  }

  setActiveScene({ id }) {
    const event = EVENTS.XSPLIT.SET.ACTIVE_SCENE;

    this.send({ event, payload: { id } });

    return xsplitRequest(event);
  }

  getAllScenes() {
    const event = EVENTS.XSPLIT.GET.SCENE.ALL;
    this.send({ event });

    return xsplitRequest(event);
  }

  /* SOURCE */
  getSceneSources(sceneId) {
    const event = EVENTS.XSPLIT.GET.SOURCE.ALL;
    this.send({ event, payload: { sceneId } });

    return xsplitRequest(event);
  }

  getSourceState(sceneId, sourceId) {
    const event = EVENTS.XSPLIT.GET.SOURCE.STATE;
    this.send({ event, payload: { sceneId, sourceId } });

    return xsplitRequest(event);
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

  /* PRESET */
  getScenePresets(sceneId) {
    const event = EVENTS.XSPLIT.GET.PRESET.ALL;
    this.send({ event, payload: { sceneId } });

    return xsplitRequest(event);
  }

  getActivePreset(sceneId) {
    const event = EVENTS.XSPLIT.GET.PRESET.ACTIVE;
    this.send({ event, payload: { sceneId } });

    return xsplitRequest(event);
  }

  setActivePreset(sceneId, presetId) {
    const event = EVENTS.XSPLIT.SET.ACTIVE_PRESET;

    this.send({
      event,
      payload: {
        sceneId,
        presetId,
      },
    });

    return xsplitRequest(event);
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

    return xsplitRequest(event);
  }

  /* SCREENSHOT */
  doScreenshot() {
    const event = EVENTS.XSPLIT.DO.SCREENSHOT;
    this.send({ event, payload: {} });

    return xsplitRequest(event);
  }

  _handleSubscription({ event, payload }) {
    if (this.callbacks.hasOwnProperty(event)) {
      this.callbacks[event](parse(payload));
    }
  }

  /* MICROPHONE */
  toggleMicrophoneState() {
    const event = EVENTS.XSPLIT.TOGGLE.MICROPHONE_STATE;

    this.send({ event, payload: {} });

    return xsplitRequest(event);
  }

  getMicrophoneState() {
    const event = EVENTS.XSPLIT.GET.MICROPHONE.STATE;
    this.send({ event, payload: {} });

    return xsplitRequest(event);
  }

  /* SPEAKER */
  toggleSpeakerState() {
    const event = EVENTS.XSPLIT.TOGGLE.SPEAKER_STATE;

    this.send({ event, payload: {} });

    return xsplitRequest(event);
  }

  getSpeakerState() {
    const event = EVENTS.XSPLIT.GET.SPEAKER.STATE;
    this.send({ event, payload: {} });

    return xsplitRequest(event);
  }

  /* SUBSCRIPTION */
  on(event, callback) {
    this.callbacks[event] = callback;

    this.send({ event: EVENTS.SUBSCRIPTION, payload: event });
  }
}

export default new XSpltHandler();
