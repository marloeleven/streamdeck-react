import { createRequest, getCallback } from "handlers/AsyncRequest";
import EVENTS from "const/events";

class XSpltHandler {
  onPayload(event, payload) {
    switch (event) {
      case EVENTS.XSPLIT.SET.ACTIVE_SCENE:
      case EVENTS.XSPLIT.GET.ACTIVE_SCENE:
      case EVENTS.XSPLIT.GET.SCENES:
        getCallback(event, payload);
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
}

export default new XSpltHandler();
