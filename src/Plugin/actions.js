import ActionsList from 'handlers/ActionsListHandler';
import XSplit from 'handlers/XSplit';
import ACTIONS from 'const/actions';
import EVENTS from 'const/events';
import { LOCAL_RECORDING } from 'const';
import State from './state';

export const handleKeyUp = ({
  action,
  context,
  payload: { settings, userDesiredState, isInMultiAction },
}) => {
  console.warn(action, { settings, userDesiredState, isInMultiAction });
  const showAlert = () => Plugin.showAlert({ context });
  switch (action) {
    case ACTIONS.SCENE:
      XSplit.setActiveScene(settings).catch(showAlert);
      break;
    case ACTIONS.SOURCE:
      if (isInMultiAction) {
        XSplit.setSourceState({ ...settings, state: userDesiredState }).catch(showAlert);
        return;
      }
      XSplit.toggleSourceState(settings).then(getSourceState).catch(showAlert);
      break;
    case ACTIONS.PRESET:
      XSplit.setActivePreset(settings).catch(showAlert);
      break;
    case ACTIONS.RECORD:
      if (isInMultiAction) {
        XSplit.setOutputState({ id: LOCAL_RECORDING, state: userDesiredState }).catch(showAlert);
        return;
      }
      XSplit.toggleOutputState({ id: LOCAL_RECORDING }).catch(showAlert);
      break;
    case ACTIONS.OUTPUT:
      if (isInMultiAction) {
        XSplit.setOutputState({ id: settings.id, state: userDesiredState }).catch(showAlert);
        return;
      }
      XSplit.toggleOutputState({ id: settings.id }).catch(showAlert);
      break;
    case ACTIONS.SCREENSHOT:
      XSplit.doScreenshot().catch(showAlert);
      break;
    case ACTIONS.MICROPHONE:
      if (isInMultiAction) {
        XSplit.setMicrophoneState({ state: userDesiredState }).catch(showAlert);
        return;
      }
      XSplit.toggleMicrophoneState()
        .then(({ state }) => toggleMicrophoneState(state))
        .catch(showAlert);
      break;
    case ACTIONS.SPEAKER:
      if (isInMultiAction) {
        XSplit.setSpeakerState({ state: userDesiredState }).catch(showAlert);
        return;
      }
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

  loopThroughList(ACTIONS.SOURCE, (settings, context) => {
    if (State.isActivePi(ACTIONS.SOURCE, context)) {
      Plugin.sendToPropertyInspector({
        action: ACTIONS.SOURCE,
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

/* OUTPUT */
/* RECORD */
export const getOutputState = async () => {
  await asyncLoopThroughList(ACTIONS.RECORD, async (settings, context) =>
    XSplit.getOutputState({ id: LOCAL_RECORDING }).then(({ state }) =>
      toggleState({ context, state }),
    ),
  );

  asyncLoopThroughList(ACTIONS.OUTPUT, async (settings, context) => {
    if (settings.id) {
      await XSplit.getOutputState({ id: settings.id }).then(({ state }) =>
        toggleState({ context, state }),
      );
    }
  });
};

export const sendToPiOutputsList = (outputs) => {
  loopThroughList(ACTIONS.OUTPUT, (settings, context) => {
    if (State.isActivePi(ACTIONS.OUTPUT, context)) {
      Plugin.sendToPropertyInspector({
        action: ACTIONS.OUTPUT,
        context,
        payload: {
          event: EVENTS.GET.ALL_OUTPUTS,
          outputs,
        },
      });
    }
  });
};

export const toggleOutputState = (id, state) => {
  if (id === LOCAL_RECORDING) {
    loopThroughList(ACTIONS.RECORD, (settings, context) => {
      toggleState({ context, state });
    });
    return;
  }
  loopThroughList(ACTIONS.OUTPUT, (settings, context) => {
    settings.id === id && toggleState({ context, state });
  });
};

/* MICROPHONE */
export const toggleMicrophoneState = (state) => {
  loopThroughList(ACTIONS.MICROPHONE, (settings, context) => {
    toggleState({ context, state });
  });
};

/* SPEAKER */
export const toggleSpeakerState = (state) => {
  loopThroughList(ACTIONS.SPEAKER, (settings, context) => {
    toggleState({ context, state });
  });
};
