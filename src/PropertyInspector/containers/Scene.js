import React, { useCallback, useEffect } from 'react';

import handler from 'handlers/PropertyInspector';
import XSplit from 'handlers/XSplit';

import EVENTS from 'const/events';
import ACTIONS from 'const/actions';

import Select from 'components/Select';

const { SUBSCRIPTION_EVENTS: SUBSCRIPTION } = EVENTS.XSPLIT;

const getScene = (scenes, id) => {
  const scene = scenes.find(scene => scene.id === id);

  return scene || scenes[0];
};

export default ({ model: { state, setScene, setList } }) => {
  const onChange = useCallback(
    async ({ target }) => {
      const scene = getScene(state.list, target.value);

      await setScene(scene);
    },
    [state.list, setScene],
  );

  useEffect(() => {
    // specify the manifest plugin action
    handler.setAction(ACTIONS.SCENE);

    XSplit.getAllScenes().then(async (scenesList = []) => {
      await setList(scenesList);
      handler.getSettings().then(async ({ settings: { id } }) => {
        const scene = getScene(scenesList, id);

        await setScene(scene);
      });
    });

    XSplit.on(SUBSCRIPTION.SCENES_LIST, payload => setList(payload));
  }, []);

  return (
    <Select value={state.id} onChange={onChange} label="Scene">
      {state.list.map(({ id, name }) => (
        <Select.Option key={id} value={id}>
          {name}
        </Select.Option>
      ))}
    </Select>
  );
};
