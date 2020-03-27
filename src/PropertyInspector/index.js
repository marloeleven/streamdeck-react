import React, { useState, useEffect } from 'react';

import Input, { RadioWrapper } from 'components/Input';
import Wrapper from 'components/Wrapper';

import COMPONENTS from 'const/components';

import PropertyInspector from 'handlers/PropertyInspector';

import Scene from 'containers/Scene';
// import Output from 'containers/Output';

import useXSplit from 'hooks/useXSplit';

import { SDConnect } from 'utils/connect';

const renderComponent = type => {
  switch (type) {
    case COMPONENTS.SCENE:
      return <Scene />;
    // case COMPONENTS.OUTPUTS:
    //   return <Output />;
    case 'radio':
      return (
        <Wrapper.Radio label="Test">
          <Input.Radio defaultValue="test" label="on" />
        </Wrapper.Radio>
      );
    case 'email':
      return <Input.Email />;
    case 'password':
      return <Input.Password />;
    default:
      return <Scene />;
  }
};

export default () => {
  const [isConnected, setIsConnected] = useState(false);
  const [componentType, setComponentType] = useState(COMPONENTS.SCENE);

  useXSplit(setIsConnected);

  useEffect(() => {
    SDConnect(PropertyInspector).then(inActionInfo => {
      const { action } = JSON.parse(inActionInfo);

      setComponentType(action.split('.').pop());
    });
  }, []);

  if (!isConnected) {
    return null;
  }

  return <div className="sdpi-wrapper">{renderComponent(componentType)}</div>;
  // return <div className="sdpi-wrapper">{renderComponent('password')}</div>;
};
