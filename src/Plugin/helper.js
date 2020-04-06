import State from './state';

export const getScenesList = () =>
  Array.from(State.scenesList.values()).map(({ id, name }) => ({ id, name }));

export const getSceneSources = (sceneId) =>
  State.getScene(sceneId).then((scene) => Array.from(scene.sources.values()));

export const getScenePresets = (sceneId) => State.getScene(sceneId).then((scene) => scene.presets);
