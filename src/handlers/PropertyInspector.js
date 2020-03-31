import EVENTS, { PLUGIN_EVENTS, GLOBAL_EVENTS } from 'const/events';
import BaseHandler from './BaseHandler';

class PropertyInspector extends BaseHandler {
  init(args) {
    super.init(args);

    this.uuid = args.uuid;
    this.setContext(this.actionInfo.context);
  }

  setAction(action) {
    this.action = action;
    return;
  }

  send(args) {
    const { event } = args;

    if (PLUGIN_EVENTS.includes(event)) {
      this.sendToPlugin(args);
      return;
    }

    if (GLOBAL_EVENTS.includes(event)) {
      args.context = this.uuid;
    }

    super.send(args);
  }

  sendToPlugin(args) {
    const { action, uuid: context } = this;

    Object.assign(args, {
      context,
      action,
      event: EVENTS.PLUGIN.SEND,
      payload: { ...args.payload, event: args.event },
    });

    super.send(args);
  }

  onMessage({ data }) {
    const jsonData = JSON.parse(data);
    const { event } = jsonData;

    this.onPayload(event, jsonData);
  }
}

export default new PropertyInspector();
