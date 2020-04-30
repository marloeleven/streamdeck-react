import React, { useCallback, useEffect } from 'react';

import handler from 'handlers/PropertyInspector';

import EVENTS from 'const/events';
import ACTIONS from 'const/actions';

import Select from 'components/Select';

import useEffectOnce from 'hooks/useEffectOnce';

const getScene = (scenes, id) => {
  const scene = scenes.find((scene) => scene.id === id);

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
    handler.on(EVENTS.GET.ALL_SCENES, async ({ scenes }) => {
      const scene = getScene(scenes, state.id);
      await setList(scenes);
      await setScene(scene);
    });
  }, [state, setList, setScene]);

  useEffectOnce(() => {
    // specify the manifest plugin action
    handler.setAction(ACTIONS.SCENE);

    handler.getSettings().then(async ({ settings: { id } }) => {
      const { scenes } = await handler.getAllScenes();

      const scene = getScene(scenes, id);

      await setList(scenes);
      await setScene(scene);
    });
  });

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
