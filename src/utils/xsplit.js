import WebSocket from 'utils/websocket';
import { createRequest, getCallback } from 'handlers/AsyncRequest';
import EVENTS from 'const/events';

class XSpltHandler {
  init({ websocket }) {
    this.ws = websocket;
  }

  onPayload(event, payload) {
    switch (event) {
      case EVENTS.SET.ACTIVE_SCENE:
      case EVENTS.GET.ACTIVE_SCENE:
      case EVENTS.GET.SCENES:
        getCallback(event, payload);
        break;
      default:
        getCallback(event, payload); // fallback
    }
  }

  // @TODO: improve
  send(data) {
    this.ws.send(JSON.stringify(data));
  }

  getActiveScene() {
    const event = EVENTS.GET.ACTIVE_SCENE;

    this.send({ event });

    return createRequest(event);
  }

  setActiveScene({ id, index }) {
    const event = EVENTS.SET.ACTIVE_SCENE;

    this.send({ event, payload: { id, index } });

    return createRequest(event);
  }

  getAllScenes() {
    const event = EVENTS.GET.SCENES;
    this.send({ event });

    return createRequest(event);
  }
}

const connect = handler => ({ port }) => {
  const onMessage = ({ data }) => {
    try {
      const { event, payload } = JSON.parse(data);

      handler.onPayload(event, payload);
    } catch (e) {
      console.error(e);
    }
  };

  const websocket = WebSocket.connect({
    port,
    handler: {
      message: onMessage,
    },
  });

  handler.init({ websocket });

  return handler;
};

export default connect(new XSpltHandler())({ port: 3333 });
