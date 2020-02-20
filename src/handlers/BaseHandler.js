import { isFunction, isObject, parse } from "utils/function";
import { createRequest, getCallback } from "handlers/AsyncRequest";
import EVENTS from "const/events";

export default class {
  constructor() {
    this.callbacks = {};

    this.settings = {};
    this.globalSettings = {};

    this.on(EVENTS.RECEIVE.SETTINGS, settings => {
      console.warn("get local settings", settings);
      this.settings = settings;
    });

    this.on(EVENTS.RECEIVE.GLOBAL_SETTINGS, settings => {
      this.globalSettings = settings;
    });
  }

  setContext(context) {
    this.context = context;

    return this;
  }

  setGlobalSettings(payload) {
    const { context } = this;
    const event = EVENTS.SET.GLOBAL_SETTINGS;

    this.globalSettings = payload;

    this.send({
      event,
      context,
      payload
    });
  }

  getGlobalSettings() {
    return this.globalSettings;
  }

  setSettings(payload) {
    const context = this.context || "";
    const event = EVENTS.SET.SETTINGS;

    this.settings = payload;

    this.send({
      event,
      context,
      payload
    });
  }

  setTitle(title, target = 0) {
    const { context } = this;
    const event = EVENTS.SET.TITLE;

    const payload = {
      title,
      target
    };

    this.send({
      event,
      context,
      payload
    });
  }

  getSettings() {
    const { context } = this;
    const event = EVENTS.GET.SETTINGS;

    console.warn({ context, event });

    this.send({ event, context });

    return createRequest(event);
  }

  openUrl(url) {
    const event = EVENTS.OPEN_URL;
    const payload = { url };

    this.send({
      event,
      payload
    });
  }

  logMessage(message) {
    const event = EVENTS.LOG_MESSAGE;
    const payload = { message };

    this.send({
      event,
      payload
    });
  }

  // https://developer.elgato.com/documentation/stream-deck/sdk/events-sent/#settitle
  // continue on this after verification of working sample

  init({ websocket, inApplicationInfo, inActionInfo = null }) {
    this.websocket = websocket;
    this.appInfo = parse(inApplicationInfo);
    this.actionInfo = parse(inActionInfo);
  }

  // HANDLES STREAMDECK COMMUNICATION
  send(args) {
    if (isObject(this.websocket) && isFunction(this.websocket.send)) {
      this.websocket.send(JSON.stringify(args));
    }
  }

  on(eventName, callback) {
    this.callbacks[eventName] = callback;

    return this;
  }

  emit(eventName, ...args) {
    const { callbacks } = this;
    const callback = callbacks[eventName];
    if (callbacks.hasOwnProperty(eventName) && isFunction(callback)) {
      return callback(...args);
    }
  }

  // override by the consuming object
  onPayload(event, payload) {
    switch (event) {
      case EVENTS.RECEIVE.SETTINGS:
        getCallback(EVENTS.GET.SETTINGS, payload);
        break;
      default:
        this.emit(event, payload);
    }
  }
}
