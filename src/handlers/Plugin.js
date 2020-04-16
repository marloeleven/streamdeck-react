import BaseHandler from './BaseHandler';
import ActionsList from './ActionsListHandler';
import EVENTS from 'const/events';

import connectionState from 'utils/connect/state';

class Plugin extends BaseHandler {
  // set an ACTION Context
  setState({ context, state }) {
    const event = EVENTS.SET.STATE;

    this.send({
      event,
      context,
      payload: {
        state,
      },
    });
  }

  // show an Ok Image to Action Instance
  showOk({ context }) {
    this.send({
      event: EVENTS.SET.SHOW_OK,
      context,
    });
  }

  // show an Alert Image to Action Instance
  showAlert({ context }) {
    this.send({
      event: EVENTS.SET.SHOW_ALERT,
      context,
    });
  }

  onPayload(args) {
    const { event, action } = args;

    /*
    if (event === EVENTS.PI.SEND) {
      this.send({
        event: payload.event,
        context,
        payload,
      });
      return;
    }
    */

    if (
      [
        EVENTS.PI.WILL_APPEAR,
        EVENTS.PI.WILL_DISAPPEAR,
        EVENTS.RECEIVE.SETTINGS,
        EVENTS.RECEIVE.GLOBAL_SETTINGS,
      ].includes(event)
    ) {
      this.emit(event, args);
    }

    switch (event) {
      case EVENTS.RECEIVE.SETTINGS:
      case EVENTS.PI.WILL_APPEAR:
        ActionsList.add(ActionsList.getList(action), args);
        break;
      case EVENTS.PI.WILL_DISAPPEAR:
        ActionsList.remove(ActionsList.getList(action), args);
        break;
      default:
        super.onPayload(event, args);
    }
  }

  onMessage({ data }) {
    const jsonData = JSON.parse(data);
    const { event, context } = jsonData;

    if (event === EVENTS.PI.APPEAR) {
      this.setContext(context);
    }

    this.onPayload(jsonData);
  }

  sendToPropertyInspector({ action, context, payload }) {
    this.send({
      context,
      action,
      event: EVENTS.TO.PROPERTY_INSPECTOR,
      payload,
    });
  }

  // updates Property inspector of connection state
  sendConnectionState({ action, context }) {
    if (action && context) {
      this.sendToPropertyInspector({
        action,
        context,
        payload: {
          event: EVENTS.GET.XSPLIT_CONNECTION_STATE,
          state: connectionState(),
        },
      });
    }
  }
}

export default new Plugin();
