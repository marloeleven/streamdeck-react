import WebSocket from "utils/websocket";

export const connect = handler => {
  return new Promise((resolve, reject) => {
    window.connectElgatoStreamDeckSocket = (
      port,
      uuid,
      event,
      inApplicationInfo,
      inActionInfo
    ) => {
      const onOpen = () => {
        websocket.send(
          JSON.stringify({
            event,
            uuid
          })
        );

        handler.init({ websocket, uuid, inApplicationInfo, inActionInfo });

        resolve(inActionInfo);
      };

      const onMessage = handler.onMessage.bind(handler);

      const websocket = WebSocket.connect({
        port,
        handler: {
          open: onOpen,
          message: onMessage
        }
      });
    };
  });
};
