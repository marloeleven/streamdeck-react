import React, { useState, useEffect } from 'react';
import { Provider, Subscribe, Container } from 'unstated';

import Input, { RadioWrapper } from 'components/Input';
import Wrapper from 'components/Wrapper';

import COMPONENTS from 'const/components';

import PropertyInspector from 'handlers/PropertyInspector';

import Scene from 'containers/Scene';
import Source from 'containers/Source';
// import Output from 'containers/Output';

import useXSplit from 'hooks/useXSplit';

import { SDConnect } from 'utils/connect';

import XSplit from 'handlers/XSplit';

import SceneModel from 'PropertyInspector/model/Scene';
import SourceModel from 'PropertyInspector/model/Source';

const renderComponent = type => {
  switch (type) {
    case COMPONENTS.SCENE:
      return <Subscribe to={[SceneModel]}>{model => <Scene model={model} />}</Subscribe>;
    case COMPONENTS.SOURCE:
      return <Subscribe to={[SourceModel]}>{source => <Source model={source} />}</Subscribe>;
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

// @DEBUGGING

window.XSplit = XSplit;
window.PropertyInspector = PropertyInspector;

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

  return (
    <Provider>
      {isConnected ? <div className="sdpi-wrapper">{renderComponent(componentType)}</div> : null}
    </Provider>
  );
};
