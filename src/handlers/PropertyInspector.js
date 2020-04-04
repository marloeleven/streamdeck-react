import EVENTS, { PLUGIN_EVENTS, GLOBAL_EVENTS } from 'const/events';
import BaseHandler from './BaseHandler';
import { createRequest, getCallback, isCallbackExist } from 'handlers/AsyncRequest';

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

  getAllScenes() {
    const { action, uuid: context } = this;

    const event = EVENTS.GET.ALL_SCENES;

    super.send({
      context,
      action,
      event: EVENTS.TO.PLUGIN,
      payload: {
        event,
      },
    });

    return createRequest(event);
  }

  getSceneSources(sceneId) {
    const { action, uuid: context } = this;

    const event = EVENTS.GET.SCENE_SOURCES;

    super.send({
      context,
      action,
      event: EVENTS.PLUGIN.SEND,
      payload: {
        event,
        sceneId,
      },
    });

    return createRequest(event);
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

  onPayload(_event, args) {
    switch (_event) {
      case EVENTS.FROM.PLUGIN:
        const {
          payload: { event, ...payload },
        } = args;

        if (isCallbackExist(event)) {
          return getCallback(event, payload);
        }

        this.emit(event, payload);
        break;
      default:
        super.onPayload(_event, args);
    }
  }

  onMessage({ data }) {
    const jsonData = JSON.parse(data);
    const { event } = jsonData;

    this.onPayload(event, jsonData);
  }
}

export default new PropertyInspector();
