import React, { useCallback, useEffect } from 'react';

import handler from 'handlers/PropertyInspector';

import EVENTS from 'const/events';
import ACTIONS from 'const/actions';

import Select from 'components/Select';

const getListValue = (list, id) => {
  const value = list.find((item) => item.id === id);

  return value || list[0] || { id: '' };
};

export default ({ model: { state, setSceneId, setScenesList, setSourceId, setSourceList } }) => {
  const getSceneSource = useCallback(
    async (sceneId) => {
      if (sceneId) {
        const { sources } = await handler.getSceneSources(sceneId);
        const source = getListValue(sources, '');
        await setSourceList(sources);
        await setSourceId(source.id);
        return;
      }

      // empty the source
      await setSourceList([]);
      await setSourceId('');
    },
    [setSourceId, setSourceList],
  );

  const onSceneChange = useCallback(
    async ({ target }) => {
      const scene = getListValue(state.scenesList, target.value);

      await setSceneId(scene.id);
      await getSceneSource(scene.id);
    },
    [setSceneId, state.scenesList, getSceneSource],
  );

  const onSourceChange = useCallback(
    ({ target }) => {
      const source = getListValue(state.sourceList, target.value);

      setSourceId(source.id);
    },
    [setSourceId, state.sourceList],
  );

  useEffect(() => {
    handler.on(EVENTS.GET.ALL_SCENES, async ({ scenes }) => {
      const scene = getListValue(scenes, state.sceneId);
      const { sources } = await handler.getSceneSources(scene.id);
      const source = getListValue(sources, state.sourceId);

      await setScenesList(scenes);
      await setSourceList(sources);
      await setSceneId(scene.id);
      await setSourceId(source.id);
    });

    handler.on(EVENTS.GET.SCENE_SOURCES, async ({ sources }) => {
      const source = getListValue(sources, state.sourceId);
      await setSourceList(sources);
      await setSourceId(source.id);
    });
  }, [state.sceneId, state.sourceId, setScenesList, setSceneId, setSourceId, setSourceList]);

  useEffect(() => {
    handler.setAction(ACTIONS.SOURCE);

    handler.getSettings().then(async ({ settings: { sceneId, sourceId } }) => {
      const { scenes } = await handler.getAllScenes();
      const scene = getListValue(scenes, sceneId);

      const { sources } = await handler.getSceneSources(scene.id);
      const source = getListValue(sources, sourceId);

      await setScenesList(scenes);
      await setSourceList(sources);
      await setSceneId(scene.id);
      await setSourceId(source.id);
    });
  }, []);

  return (
    <>
      <Select value={state.sceneId} onChange={onSceneChange} label="Scene">
        {state.scenesList.map(({ id, name }) => (
          <Select.Option key={id} value={id}>
            {name}
          </Select.Option>
        ))}
      </Select>

      <Select value={state.sourceId} onChange={onSourceChange} label="Source">
        {state.sourceList.map(({ id, name }) => (
          <Select.Option key={id} value={id}>
            {name}
          </Select.Option>
        ))}
      </Select>
    </>
  );
};
