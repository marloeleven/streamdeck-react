import React, { useState, useEffect } from "react";

import Input, { RadioWrapper } from "components/Input";
import Wrapper from "components/Wrapper";

import COMPONENTS from "const/components";

import WebSocket from "utils/websocket";

import handler from "handlers/PropertyInspector";

import Scene from "containers/Scene";

const renderComponent = type => {
  switch (type) {
    case COMPONENTS.SCENE:
      return <Scene />;
    case "radio":
      return (
        <Wrapper.Radio label="Test">
          <Input.Radio defaultValue="test" label="on" />
        </Wrapper.Radio>
      );
    case "email":
      return <Input.Email />;
    case "password":
      return <Input.Password />;
    default:
      return <Scene />;
  }
};

export default () => {
  // const [isConnecting, setIsConnecting] = useState(true); // @DEBUG
  const [isConnecting, setIsConnecting] = useState(!true); // DEBUG
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
            uuid
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
          message: onMessage
        }
      });

      const { action } = JSON.parse(inActionInfo);

      setComponentType(action.split(".").pop());
    };
  }, []);

  if (isConnecting) {
    return null;
  }

  return <div className="sdpi-wrapper">{renderComponent(componentType)}</div>;
  // return <div className="sdpi-wrapper">{renderComponent('password')}</div>;
};
