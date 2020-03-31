import ActionsList, { ACTIONS } from 'handlers/ActionsListHandler';

export const toggleState = ({ context, state }) => Plugin.setState({ context, state });

const getList = action => Object.values(ActionsList.getList(action));

const loopThroughList = (action, callback) => {
  getList(action).forEach(({ payload: { settings }, context }) => {
    callback(settings, context);
  });
};

/* SCENE */
export const toggleSceneState = id => {
  loopThroughList(ACTIONS.SCENE, (settings, context) => {
    const state = Number(id === settings.id);
    toggleState({ context, state });
  });
};

/* SOURCE */

export const toggleSourceState = (sceneId, sourceId, state) => {
  loopThroughList(ACTIONS.SOURCE, (settings, context) => {
    if (sceneId === settings.sceneId && sourceId === settings.sourceId) {
      toggleState({ context, state });
    }
  });
};
