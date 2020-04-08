import React, { useState, useEffect } from 'react';
import { Provider, Subscribe } from 'unstated';

import COMPONENTS from 'const/components';

import PropertyInspector from 'handlers/PropertyInspector';

import Scene from 'containers/Scene';
import Source from 'containers/Source';
import Preset from 'containers/Preset';
import Output from 'containers/Output';

import { SDConnect } from 'utils/connect';

import SceneModel from 'PropertyInspector/model/Scene';
import SourceModel from 'PropertyInspector/model/Source';
import PresetModel from 'PropertyInspector/model/Preset';
import OutputModel from 'PropertyInspector/model/Output';

const renderComponent = (type) => {
  switch (type) {
    case COMPONENTS.SCENE:
      return <Subscribe to={[SceneModel]}>{(model) => <Scene model={model} />}</Subscribe>;
    case COMPONENTS.SOURCE:
      return <Subscribe to={[SourceModel]}>{(source) => <Source model={source} />}</Subscribe>;
    case COMPONENTS.PRESET:
      return <Subscribe to={[PresetModel]}>{(preset) => <Preset model={preset} />}</Subscribe>;
    case COMPONENTS.OUTPUT:
      return <Subscribe to={[OutputModel]}>{(output) => <Output model={output} />}</Subscribe>;
    case COMPONENTS.RECORD:
    case COMPONENTS.SCREENSHOT:
    case COMPONENTS.MICRPHONE:
    case COMPONENTS.SPEAKER:
      return null;
    default:
      return <Scene />;
  }
};

// @DEBUGGING
window.PropertyInspector = PropertyInspector;

export default () => {
  const [isConnected, setIsConnected] = useState(false);
  const [componentType, setComponentType] = useState(COMPONENTS.SCENE);

  useEffect(() => {
    SDConnect(PropertyInspector).then((inActionInfo) => {
      const { action } = JSON.parse(inActionInfo);

      setComponentType(action.split('.').pop());
      setIsConnected(true);
    });
  }, []);

  return (
    <Provider>
      {isConnected ? <div className="sdpi-wrapper">{renderComponent(componentType)}</div> : null}
    </Provider>
  );
};
