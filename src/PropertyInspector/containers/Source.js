import React, { useCallback, useEffect, useState } from 'react';
import produce from 'immer';

import handler from 'handlers/PropertyInspector';
import XSplit from 'handlers/XSplit';

import EVENTS from 'const/events';
import ACTIONS from 'const/actions';

import Select from 'components/Select';

const { SUBSCRIPTION_EVENTS: SUBSCRIPTION } = EVENTS.XSPLIT;

const getListValue = (list, id) => {
  const value = list.find(item => item.id === id);

  return value || Object.values(list).shift();
};

export default () => {
  const [list, setList] = useState({
    scene: [],
    source: [],
  });
  const [selected, setSelected] = useState({
    scene: '',
    source: '',
  });

  const getSceneSource = useCallback(
    sceneId => {
      if (sceneId) {
        XSplit.getSceneSources(sceneId).then((sourceList = []) => {
          setList(
            produce(draft => {
              draft.source = sourceList;
            }),
          );

          const source = getListValue(sourceList, selected.source);

          setSelected(
            produce(draft => {
              draft.source = source.id;
            }),
          );

          handler.setSettings({ scene: sceneId, source: source.id });
        });
        return;
      }

      // empty the source
      setList(
        produce(draft => {
          draft.source = [];
        }),
      );
    },
    [selected.source],
  );

  const onSceneChange = useCallback(
    ({ target }) => {
      const scene = getListValue(list.scene, target.value);

      setSelected(
        produce(draft => {
          draft.scene = scene.id;
        }),
      );

      getSceneSource(scene.id);

      handler.setSettings({ ...selected, scene: scene.id });
    },
    [list.scene, selected, getSceneSource],
  );

  const onSourceChange = useCallback(
    ({ target }) => {
      const source = getListValue(list.source, target.value);

      setSelected(
        produce(draft => {
          draft.source = source.id;
        }),
      );

      handler.setSettings({ ...selected, source: source.id });
    },
    [list.source, selected],
  );

  // 3. get source list base from scene id
  useEffect(() => {
    // filter initial value
    if (selected.scene) {
      getSceneSource(selected.scene);
    }
  }, [selected.scene, getSceneSource]);

  useEffect(() => {
    // specify the manifest plugin action
    handler.setAction(ACTIONS.SOURCE);

    // 1. load settings
    handler.getSettings().then(({ settings: { scene, source } }) => {
      setSelected({ scene, source });

      // 2. get all scenes and select the saved id else select first
      XSplit.getAllScenes().then((scenesList = []) => {
        setList(
          produce(draft => {
            draft.scene = scenesList;
          }),
        );

        const { id } = getListValue(scenesList, scene);

        setSelected(
          produce(draft => {
            draft.scene = id;
          }),
        );
      });
    });

    // updates scenes list
    // will automatically trigger source list update when
    // selected scene is deleted
    XSplit.on(SUBSCRIPTION.SCENES_LIST, payload =>
      setList(
        produce(draft => {
          draft.scene = payload;
        }),
      ),
    );

    // count number of sources in extension and emit on change
    XSplit.on(SUBSCRIPTION.SOURCE_VISIBILIY, ({ sceneId, sourceId, state }) => {
      // @TODO
      // if sceneId === selected.scene -> getSceneSources(selecte.scene)
    });
  }, []);

  return (
    <>
      <Select value={selected.scene} onChange={onSceneChange} label="Scene">
        {list.scene.map(({ id, name }) => (
          <Select.Option key={id} value={id}>
            {name}
          </Select.Option>
        ))}
      </Select>

      <Select value={selected.source} onChange={onSourceChange} label="Source">
        {list.source.map(({ id, name }) => (
          <Select.Option key={id} value={id}>
            {name}
          </Select.Option>
        ))}
      </Select>
    </>
  );
};
