import { useEffect } from 'react';
import handler from 'handlers/Plugin';

import EVENTS from 'const/events';

import WebSocket from 'utils/websocket';
import XSplit from 'utils/xsplit';

export default () => {
  useEffect(() => {
    window.connectElgatoStreamDeckSocket = (
      port,
      uuid,
      event,
      inApplicationInfo
    ) => {
      const onOpen = () => {
        websocket.send(
          JSON.stringify({
            event,
            uuid,
          })
        );

        handler.init({ websocket, inApplicationInfo });
      };

      const onMessage = ({ data }) => {
        const jsonData = JSON.parse(data);
        const { event, context } = jsonData;

        console.warn(data);
        if (event === EVENTS.PI.APPEAR) {
          handler.setContext(context);
        }

        handler.onPayload(JSON.parse(data));
      };

      const websocket = WebSocket.connect({
        port,
        handler: {
          open: onOpen,
          message: onMessage,
        },
      });

      handler.on(EVENTS.PLUGIN.KEY_UP, ({ settings }) =>
        XSplit.setActiveScene(settings)
      );
    };
  }, []);

  return null;
};
