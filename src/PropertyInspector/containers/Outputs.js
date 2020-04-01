import React, { useCallback, useEffect, useState } from 'react';

import handler from 'handlers/PropertyInspector';
import XSplit from 'handlers/XSplit';

import EVENTS from 'const/events';
import ACTIONS from 'const/actions';

import Select from 'components/Select';

const { SUBSCRIPTION_EVENTS: SUBSCRIPTION } = EVENTS.XSPLIT;

const getScene = (scenes, id) => {
  const scene = scenes.find(scene => scene.id === id);

  return scene || Object.values(scenes).shift();
};

const updateSettings = scene => {
  handler.setSettings(scene);

  handler.setTitle(scene.name);
};

export default () => {
  const [scenesList, setScenesList] = useState([]);
  const [selectedScene, setSelectedScene] = useState('');

  const onChange = useCallback(
    ({ target }) => {
      const scene = getScene(scenesList, target.value);

      setSelectedScene(scene.id);
      updateSettings(scene);
    },
    [scenesList],
  );

  useEffect(() => {
    // specify the manifest plugin action
    handler.setAction(ACTIONS.SCENE);

    XSplit.getAllScenes().then((scenesList = []) => {
      console.warn('scene list', scenesList);
      setScenesList(scenesList);
      handler.getSettings().then(({ settings: { id } }) => {
        setSelectedScene(id);
        const scene = getScene(scenesList, id);

        scene && updateSettings(scene);
      });
    });

    XSplit.on(SUBSCRIPTION.SCENE_CHANGE, payload => {
      console.warn('SUBSCRIPTION', payload);
    });

    XSplit.on(SUBSCRIPTION.SCENES_LIST, payload => {
      console.warn('scenesList', payload);

      setScenesList(payload);
    });

    // @TODO
    // listener to on activate
    handler.on(EVENTS.ACTIVATE, () => {
      // XSplit.setActiveScene(id)
    });
  }, []);

  return (
    <Select value={selectedScene} onChange={onChange} label="Scene">
      {scenesList.map(({ id, name }) => (
        <Select.Option key={id} value={id}>
          {name}
        </Select.Option>
      ))}
    </Select>
  );
};