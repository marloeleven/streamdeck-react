import { isFunction, isObject, parse, toString } from 'utils/function';
import { createRequest, getCallback } from 'handlers/AsyncRequest';
import EVENTS from 'const/events';

export default class {
  constructor() {
    this.callbacks = {};

    // this.settings = {};
    // this.globalSettings = {};

    // this.on(EVENTS.RECEIVE.SETTINGS, settings => {
    //   this.settings = settings;
    // });

    // this.on(EVENTS.RECEIVE.GLOBAL_SETTINGS, settings => {
    //   this.globalSettings = settings;
    // });
  }

  setContext(context) {
    this.context = context;

    return this;
  }

  setGlobalSettings(payload) {
    const { context } = this;
    const event = EVENTS.SET.GLOBAL_SETTINGS;

    this.send({
      event,
      context,
      payload,
    });
  }

  getGlobalSettings() {
    const event = EVENTS.GET.GLOBAL_SETTINGS;
    const context = this.context || '';

    this.send({ event, context });

    return createRequest(event);
  }

  setSettings(payload) {
    const context = this.context || '';
    const event = EVENTS.SET.SETTINGS;

    console.warn('SAVE SETTINGS', payload);

    this.send({
      event,
      context,
      payload,
    });
  }

  setTitle(title, target = 0) {
    const { context } = this;
    const event = EVENTS.SET.TITLE;

    const payload = {
      title,
      target,
    };

    this.send({
      event,
      context,
      payload,
    });
  }

  getSettings() {
    const { context } = this;

    const event = EVENTS.GET.SETTINGS;

    this.send({ event, context });

    return createRequest(event);
  }

  openUrl(url) {
    const event = EVENTS.OPEN_URL;
    const payload = { url };

    this.send({
      event,
      payload,
    });
  }

  logMessage(message) {
    const event = EVENTS.LOG_MESSAGE;
    const payload = { message };

    this.send({
      event,
      payload,
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
      this.websocket.send(toString(args));
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

  // extended by the consuming object
  onPayload(event, args) {
    switch (event) {
      case EVENTS.RECEIVE.SETTINGS:
        getCallback(EVENTS.GET.SETTINGS, args.payload);
        break;
      case EVENTS.RECEIVE.GLOBAL_SETTINGS:
        getCallback(EVENTS.GET.GLOBAL_SETTINGS, args.payload);
        break;
      default:
        this.emit(event, args);
    }
  }
}
