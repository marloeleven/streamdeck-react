import XSplit from 'handlers/XSplit';
import ActionsList from 'handlers/ActionsListHandler';
import ACTIONS from 'const/actions';

export const toggleState = ({ context, state }) => Plugin.setState({ context, state });

const getList = action => Object.values(ActionsList.getList(action));

const loopThroughList = (action, callback) => {
  getList(action).forEach(({ payload: { settings }, context }) => callback(settings, context));
};

const wrapAsyncCallback = callback => new Promise(resolve => callback().then(resolve));

const asyncLoopThroughList = async (action, callback) => {
  const list = getList(action);

  for (const item of list) {
    const {
      payload: { settings },
      context,
    } = item;

    await wrapAsyncCallback(() => callback(settings, context));
  }
};

/* SCENE */
export const toggleSceneState = id => {
  loopThroughList(ACTIONS.SCENE, (settings, context) => {
    const state = Number(id === settings.id);
    toggleState({ context, state });
  });
};

/* SOURCE */
export const getSourceState = () => {
  asyncLoopThroughList(ACTIONS.SOURCE, (settings, context) =>
    XSplit.getSourceState(settings.sceneId, settings.sourceId).then(({ state }) =>
      toggleState({ context, state }),
    ),
  );
};

export const toggleSourceState = (sceneId, sourceId, state) => {
  loopThroughList(ACTIONS.SOURCE, (settings, context) => {
    if (sceneId === settings.sceneId && sourceId === settings.sourceId) {
      toggleState({ context, state });
    }
  });
};

/* RECORD */
export const toggleRecordingState = state => {
  loopThroughList(ACTIONS.RECORD, (settings, context) => {
    toggleState({ context, state });
  });
};

/* MICROPHONE */
export const toggleMicrophoneState = state => {
  loopThroughList(ACTIONS.MICRPHONE, (settings, context) => {
    toggleState({ context, state });
  });
};

/* SPEAKER */
export const toggleSpeakerState = state => {
  loopThroughList(ACTIONS.SPEAKER, (settings, context) => {
    toggleState({ context, state });
  });
};
