import React, { useState, useEffect } from "react";

import Input, { RadioWrapper } from "components/Input";
import Wrapper from "components/Wrapper";

import COMPONENTS from "const/components";

import handler from "handlers/PropertyInspector";

import Scene from "containers/Scene";

import { connect } from "handlers/SDConnect";

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
  const [isConnecting, setIsConnecting] = useState(true); // DEBUG
  const [componentType, setComponentType] = useState(COMPONENTS.SCENE);

  useEffect(() => {
    connect(handler).then(inActionInfo => {
      const { action } = JSON.parse(inActionInfo);

      setComponentType(action.split(".").pop());
      setIsConnecting(false);
    });
  }, []);

  if (isConnecting) {
    return null;
  }

  return <div className="sdpi-wrapper">{renderComponent(componentType)}</div>;
  // return <div className="sdpi-wrapper">{renderComponent('password')}</div>;
};
