import React, { useCallback, useEffect } from 'react';

import handler from 'handlers/PropertyInspector';
import XSplit from 'handlers/XSplit';

import EVENTS from 'const/events';
import ACTIONS from 'const/actions';

import Select from 'components/Select';

const { SUBSCRIPTION_EVENTS: SUBSCRIPTION } = EVENTS.XSPLIT;

const getListValue = (list, id) => {
  const value = list.find(item => item.id === id);

  return value || list[0] || { id: '' };
};

export default ({ model: { state, setSceneId, setScenesList, setSourceId, setSourceList } }) => {
  const getSceneSource = useCallback(
    async sceneId => {
      if (sceneId) {
        XSplit.getSceneSources(sceneId).then(async (sourceList = []) => {
          await setSourceList(sourceList);

          const source = getListValue(sourceList, state.sourceId);

          setSourceId(source.id);
        });
        return;
      }

      // empty the source
      await setSourceList([]);

      await setSourceId('');
    },
    [setSourceId, setSourceList, state.sourceId],
  );

  const onSceneChange = useCallback(
    async ({ target }) => {
      const scene = getListValue(state.scenesList, target.value);

      await setSceneId(scene.id);
      await setSourceId('');

      getSceneSource(scene.id);
    },
    [setSceneId, setSourceId, state.scenesList, getSceneSource],
  );

  const onSourceChange = useCallback(
    ({ target }) => {
      const source = getListValue(state.sourceList, target.value);

      setSourceId(source.id);
    },
    [setSourceId, state.sourceList],
  );

  // 3. get source list base from scene id
  useEffect(() => {
    // filter initial value
    if (state.sceneId) {
      getSceneSource(state.sceneId);
    }
  }, [state.sceneId, getSceneSource]);

  // subscription to source items count
  useEffect(() => {
    XSplit.on(SUBSCRIPTION.SOURCE_COUNT, ({ sceneId, count }) => {
      if (sceneId === state.sceneId && state.sourceList.length !== count) {
        getSceneSource(sceneId);
      }
    });
  }, [state.sceneId, state.sourceList, getSceneSource]);

  useEffect(() => {
    // specify the manifest plugin action
    handler.setAction(ACTIONS.SOURCE);

    // 1. load settings
    handler.getSettings().then(async ({ settings: { sceneId, sourceId } }) => {
      // 2. get all scenes and select the saved id else select first
      XSplit.getAllScenes().then(async (scenesList = []) => {
        await setScenesList(scenesList);

        const { id } = getListValue(scenesList, sceneId);

        await setSceneId(id);
        await setSourceId(sourceId);
      });
    });

    // updates scenes list
    // will automatically trigger source list update when
    // selected scene is deleted
    XSplit.on(SUBSCRIPTION.SCENES_LIST, payload => setScenesList(payload));
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
