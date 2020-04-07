import React, { useCallback, useEffect } from 'react';

import handler from 'handlers/PropertyInspector';

import EVENTS from 'const/events';
import ACTIONS from 'const/actions';

import Select from 'components/Select';

const getListValue = (list, id) => {
  const value = list.find((item) => item.id === id);

  return value || list[0] || { id: '' };
};

const getValueInArray = (array, id) => {
  if (array.includes(id)) {
    return id;
  }

  return array[0];
};

export default ({ model: { state, setSceneId, setScenesList, setPresetId, setPresetList } }) => {
  const getScenePresets = useCallback(
    async (sceneId) => {
      if (sceneId) {
        const { presets } = await handler.getScenePresets(sceneId);
        const presetId = getValueInArray(presets, '');
        await setPresetList(presets);
        await setPresetId(presetId);
        return;
      }

      // empty the source
      await setPresetList([]);
      await setPresetId('');
    },
    [setPresetId, setPresetList],
  );

  const onSceneChange = useCallback(
    async ({ target }) => {
      const scene = getListValue(state.scenesList, target.value);

      await setSceneId(scene.id);
      await getScenePresets(scene.id);
    },
    [setSceneId, state.scenesList, getScenePresets],
  );

  const onPresetChange = useCallback(
    ({ target }) => {
      const preset = getValueInArray(state.presetList, target.value);

      setPresetId(preset);
    },
    [setPresetId, state.presetList],
  );

  useEffect(() => {
    handler.on(EVENTS.GET.ALL_SCENES, async ({ scenes }) => {
      const scene = getListValue(scenes, state.sceneId);
      const { presets } = await handler.getScenePresets(scene.id);
      const presetId = getValueInArray(presets, state.presetId);

      await setScenesList(scenes);
      await setPresetList(presets);
      await setSceneId(scene.id);
      await setPresetId(presetId);
    });

    handler.on(EVENTS.GET.SCENE_PRESETS, async ({ presets }) => {
      const presetId = getValueInArray(presets, state.presetId);
      await setPresetList(presets);
      await setPresetId(presetId);
    });
  }, [state.sceneId, state.presetId, setScenesList, setSceneId, setPresetId, setPresetList]);

  useEffect(() => {
    handler.setAction(ACTIONS.PRESET);

    handler.getSettings().then(async ({ settings: { sceneId, presetId } }) => {
      const { scenes } = await handler.getAllScenes();
      const scene = getListValue(scenes, sceneId);

      const { presets } = await handler.getScenePresets(scene.id);
      const preset = getValueInArray(presets, presetId);

      await setScenesList(scenes);
      await setPresetList(presets);
      await setSceneId(scene.id);
      await setPresetId(preset);
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

      <Select value={state.presetId} onChange={onPresetChange} label="Preset">
        {state.presetList.map((id, index) => (
          <Select.Option key={id} value={id}>
            Preset {index + 1}
          </Select.Option>
        ))}
      </Select>
    </>
  );
};
