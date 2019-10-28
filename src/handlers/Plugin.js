import BaseHandler from './BaseHandler';
import EVENTS from 'const/events';

class Plugin extends BaseHandler {
  onPayload(args) {
    const { event, context, payload } = args;

    if (event === EVENTS.PLUGIN.SEND) {
      this.send({
        event: payload.event,
        context,
        payload,
      });
      return;
    }

    super.onPayload(event, payload);
  }
}

export default new Plugin();
