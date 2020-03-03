import BaseHandler from "./BaseHandler";
import EVENTS from "const/events";

class Plugin extends BaseHandler {
  onPayload(args) {
    const { event, context, payload } = args;

    if (event === EVENTS.PI.SEND) {
      this.send({
        event: payload.event,
        context,
        payload
      });
      return;
    }

    super.onPayload(event, payload);
  }

  onMessage({ data }) {
    const jsonData = JSON.parse(data);
    const { event, context } = jsonData;

    if (event === EVENTS.PI.APPEAR) {
      this.setContext(context);
    }

    this.onPayload(JSON.parse(data));
  }
}

export default new Plugin();
