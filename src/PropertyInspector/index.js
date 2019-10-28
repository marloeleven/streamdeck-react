import React, { useState, useCallback, useEffect } from 'react';

import COMPONENTS from 'const/components';

import WebSocket from 'utils/websocket';

import handler from 'handlers/PropertyInspector';

import Scene from 'containers/Scene';

export default () => {
  const [isConnecting, setIsConnecting] = useState(true);
  const [componentType, setComponentType] = useState(COMPONENTS.SCENE);

  useEffect(() => {
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
            uuid,
          })
        );

        handler.init({ websocket, uuid, inApplicationInfo, inActionInfo });

        setIsConnecting(false);
      };

      const onMessage = ({ data }) => {
        const { payload, event } = JSON.parse(data);

        handler.onPayload(event, payload);
      };

      const websocket = WebSocket.connect({
        port,
        handler: {
          open: onOpen,
          message: onMessage,
        },
      });

      const { action } = JSON.parse(inActionInfo);

      setComponentType(action.split('.').pop());
    };
  }, []);

  const renderContent = useCallback(() => {
    if (isConnecting) {
      return null;
    }

    switch (componentType) {
      case COMPONENTS.SCENE:
        return <Scene />;
      default:
        return <Scene />;
    }
  }, [componentType, isConnecting]);

  return renderContent();
};
