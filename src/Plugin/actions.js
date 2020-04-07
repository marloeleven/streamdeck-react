import ActionsList from 'handlers/ActionsListHandler';
import XSplit from 'handlers/XSplit';
import ACTIONS from 'const/actions';
import EVENTS from 'const/events';
import State from './state';

export const handleKeyUp = ({ action, context, payload: { settings } }) => {
  const showAlert = () => Plugin.showAlert({ context });
  switch (action) {
    case ACTIONS.SCENE:
      XSplit.setActiveScene(settings).catch(showAlert);
      break;
    case ACTIONS.SOURCE:
      XSplit.toggleSourceState(settings).catch(showAlert);
      break;
    case ACTIONS.PRESET:
      console.clear();
      console.warn('setActivePreset', settings);
      XSplit.setActivePreset(settings).catch(showAlert);
      break;
    case ACTIONS.RECORD:
      XSplit.toggleRecordingState().catch(showAlert);
      break;
    case ACTIONS.SCREENSHOT:
      XSplit.doScreenshot().catch(showAlert);
      break;
    case ACTIONS.MICRPHONE:
      XSplit.toggleMicrophoneState()
        .then(({ state }) => toggleMicrophoneState(state))
        .catch(showAlert);
      break;
    case ACTIONS.SPEAKER:
      XSplit.toggleSpeakerState()
        .then(({ state }) => toggleSpeakerState(state))
        .catch(showAlert);
      break;
    default:
      // none
      break;
  }
};

export const toggleState = ({ context, state }) => Plugin.setState({ context, state });

export const getList = (action) => Object.values(ActionsList.getList(action));

export const getActionContext = (action, context) => {
  if (ActionsList.list.hasOwnProperty(action)) {
    if (ActionsList.list[action].hasOwnProperty(context)) {
      return ActionsList.list[action][context];
    }
  }

  return false;
};

const loopThroughList = (action, callback) => {
  getList(action).forEach(({ payload: { settings }, context }) => callback(settings, context));
};

const wrapAsyncCallback = (callback) =>
  new Promise((resolve) =>
    callback()
      .then(resolve)
      .catch((e) => console.log('this waht', e)),
  );

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
export const toggleSceneState = (id) => {
  loopThroughList(ACTIONS.SCENE, (settings, context) => {
    const state = Number(id === settings.id);
    toggleState({ context, state });
  });
};

export const sendToPiScenesList = (scenes) => {
  loopThroughList(ACTIONS.SCENE, (settings, context) => {
    if (State.isActivePi(ACTIONS.SCENE, context)) {
      Plugin.sendToPropertyInspector({
        action: ACTIONS.SCENE,
        context,
        payload: {
          event: EVENTS.GET.ALL_SCENES,
          scenes,
        },
      });
    }
  });
};

/* SOURCE */
export const getSourceState = () => {
  asyncLoopThroughList(
    ACTIONS.SOURCE,
    async (settings, context) =>
      await (settings.sourceId &&
        XSplit.getSourceState(settings.sceneId, settings.sourceId).then(({ state }) =>
          toggleState({ context, state }),
        )),
  );
};

export const toggleSourceState = (sceneId, sourceId, state) => {
  loopThroughList(ACTIONS.SOURCE, (settings, context) => {
    if (sceneId === settings.sceneId && sourceId === settings.sourceId) {
      toggleState({ context, state });
    }
  });
};

export const sendToPiSourceList = (sceneId, sources) => {
  loopThroughList(ACTIONS.SOURCE, (settings, context) => {
    if (State.isActivePi(ACTIONS.SOURCE, context) && sceneId === settings.sceneId) {
      Plugin.sendToPropertyInspector({
        action: ACTIONS.SOURCE,
        context,
        payload: {
          event: EVENTS.GET.SCENE_SOURCES,
          sources,
        },
      });
    }
  });
};

/* PRESETS */

export const getPresetState = () => {
  asyncLoopThroughList(ACTIONS.PRESET, async (settings, context) =>
    XSplit.getActivePreset(settings.sceneId).then((presetId) => {
      const state = Number(settings.presetId === presetId);
      toggleState({ context, state });
    }),
  );
};

export const sendToPiPresetsList = (sceneId, presets) => {
  loopThroughList(ACTIONS.PRESET, (settings, context) => {
    if (State.isActivePi(ACTIONS.PRESET, context) && sceneId === settings.sceneId) {
      Plugin.sendToPropertyInspector({
        action: ACTIONS.PRESET,
        context,
        payload: {
          event: EVENTS.GET.SCENE_PRESETS,
          presets,
        },
      });
    }
  });
};

export const togglePresetState = (sceneId, presetId) => {
  loopThroughList(ACTIONS.PRESET, (settings, context) => {
    if (settings.sceneId === sceneId) {
      const state = Number(settings.presetId === presetId);
      toggleState({ context, state });
    }
  });
};

/* RECORD */
export const toggleRecordingState = (state) => {
  loopThroughList(ACTIONS.RECORD, (settings, context) => {
    toggleState({ context, state });
  });
};

/* MICROPHONE */
export const toggleMicrophoneState = (state) => {
  loopThroughList(ACTIONS.MICRPHONE, (settings, context) => {
    toggleState({ context, state });
  });
};

/* SPEAKER */
export const toggleSpeakerState = (state) => {
  loopThroughList(ACTIONS.SPEAKER, (settings, context) => {
    toggleState({ context, state });
  });
};
