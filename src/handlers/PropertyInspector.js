import { isFunction, isObject } from "utils/function";
import EVENTS, { PLUGIN_EVENTS, GLOBAL_EVENTS } from "const/events";
import BaseHandler from "./BaseHandler";

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

    if (GLOBAL_EVENTS.concat(PLUGIN_EVENTS).includes(event)) {
      args.context = this.uuid;

      if (PLUGIN_EVENTS.includes(event)) {
        const { action } = this;
        Object.assign(args, {
          action,
          event: EVENTS.PLUGIN.SEND,
          payload: { ...args.payload, event }
        });
      }
    }

    if (isObject(this.websocket) && isFunction(this.websocket.send)) {
      super.send(args);
    }
  }
}

export default new PropertyInspector();
