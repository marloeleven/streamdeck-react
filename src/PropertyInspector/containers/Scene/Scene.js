import React, { useCallback, useEffect, useState } from "react";

import handler from "handlers/PropertyInspector";

import XSplit from "utils/xsplit";

import EVENTS from "const/events";
import ACTIONS from "const/actions";

import Select from "components/Select";

export default () => {
  const [scenesList, setScenesList] = useState([]);
  const [selectedScene, setSelectedScene] = useState("");

  const onChange = useCallback(
    ({ target }) => {
      const index = target.value;
      const scene = scenesList[index];
      const { id } = scene;

      setSelectedScene(id);

      handler.setSettings(scene);

      handler.setTitle(scene.name);
    },
    [scenesList]
  );

  useEffect(() => {
    XSplit.getAllScenes()
      .then(setScenesList)
      .then(() => {
        console.warn("handler.getSettings");
        handler.getSettings().then(({ settings: { id } }) => {
          console.warn("saved id:", { id });
          setSelectedScene(id);
        });
      });

    handler.setAction(ACTIONS.SCENE);

    handler.on(EVENTS.ACTIVATE, () => {});

    // target
    // notify on scenes list change
    handler.on(EVENTS.RECEIVE.SCENES, payload => {
      console.warn("scenesList", payload);

      // setScenesList();
    });

    console.warn("initialize");
  }, []);

  return (
    <Select value={selectedScene.index} onChange={onChange} label="Scene">
      {scenesList.map(({ id, name }, index) => (
        <Select.Option key={id} value={index}>
          {name}
        </Select.Option>
      ))}
    </Select>
  );
};
