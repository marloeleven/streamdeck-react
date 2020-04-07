import once from 'lodash/fp/once';

import Plugin from 'handlers/Plugin';
import XSplit from 'handlers/XSplit';

import EVENTS from 'const/events';
import ACTIONS from 'const/actions';

import State from './state';

import {
  getActionContext,
  // send to opened pi
  sendToPiScenesList,
  sendToPiSourceList,
  sendToPiPresetsList,

  // state toggling

  // get intial state
  getSourceState,
  getPresetState,

  // subscription toggle
  toggleSceneState,
  toggleState,
  toggleSourceState,
  togglePresetState,
  toggleRecordingState,
  toggleMicrophoneState,
  toggleSpeakerState,
} from './actions';

import { getScenesList, getSceneSources, getScenePresets } from './helper';

const { SUBSCRIPTION_EVENTS: SUBSCRIPTION } = EVENTS.XSPLIT;

// ON CONNECT GET CURRENT STATE
const getState = async () => {
  XSplit.getActiveScene().then(({ id }) => toggleSceneState(id));

  getSourceState();

  getPresetState();

  XSplit.getRecordingState().then(({ state }) => toggleRecordingState(state));

  XSplit.getMicrophoneState().then(({ state }) => toggleMicrophoneState(state));
  XSplit.getSpeakerState().then(({ state }) => toggleSpeakerState(state));
};

const getAllList = async () =>
  await XSplit.getAllScenes().then(async (scenesList = []) => {
    for (const sceneItem of scenesList) {
      await State.addScene(sceneItem).then(async (scene) => {
        await XSplit.getSceneSources(scene.id).then((sources) => scene.setSources(sources));
        return XSplit.getScenePresets(scene.id).then((presets) => scene.setPresets(presets));
      });
    }
  });

// SUBSCRIBE TO XSPLIT EVENTS
const onXSplitEvents = () => {
  console.log('TRIGGER XSPLIT SUBSCRIPTIOM');
  XSplit.on(SUBSCRIPTION.SCENES_LIST, async (payload) => {
    XSplit.getAllScenes().then(async (scenes) => {
      console.warn('SCENES:', scenes, payload);
      await State.updateList(scenes);

      sendToPiScenesList(getScenesList());
    });
  });

  XSplit.on(SUBSCRIPTION.SOURCE_COUNT, ({ sceneId, count }) => {
    State.getScene(sceneId).then(async (scene) => {
      await XSplit.getSceneSources(sceneId).then((sources) => scene.setSources(sources));

      sendToPiSourceList(sceneId, await getSceneSources(sceneId));
    });
  });

  XSplit.on(SUBSCRIPTION.PRESET_LIST, ({ sceneId, presets }) => {
    State.getScene(sceneId).then(async (scene) => {
      scene.setPresets(presets);

      sendToPiPresetsList(sceneId, await getScenePresets(sceneId));
    });
  });

  XSplit.on(SUBSCRIPTION.PRESET_CHANGE, ({ sceneId, presetId }) => {
    togglePresetState(sceneId, presetId);
  });

  XSplit.on(SUBSCRIPTION.SCENE_CHANGE, ({ id }) => toggleSceneState(id));

  XSplit.on(SUBSCRIPTION.SOURCE_VISIBILIY, ({ sceneId, sourceId, state }) =>
    toggleSourceState(sceneId, sourceId, state),
  );

  XSplit.on(SUBSCRIPTION.RECORDING_STATE, ({ state }) => toggleRecordingState(state));

  XSplit.on(SUBSCRIPTION.MICROPHONE_STATE, ({ state }) => {
    toggleMicrophoneState(state);
  });

  XSplit.on(SUBSCRIPTION.SPEAKER_STATE, ({ state }) => {
    toggleSpeakerState(state);
  });
};

const onSettingsChange = () => {
  // checks for state on settings update from PI
  Plugin.on(EVENTS.RECEIVE.SETTINGS, ({ action, context, payload: { settings } }) => {
    if (action === ACTIONS.SCENE) {
      XSplit.getActiveScene().then(({ id }) => {
        const state = Number(settings.id === id);
        toggleState({ context, state });
      });
      return;
    }

    if (action === ACTIONS.SOURCE) {
      if (settings.sourceId) {
        XSplit.getSourceState(settings.sceneId, settings.sourceId).then(({ state }) => {
          toggleState({ context, state });
        });
        return;
      }
      toggleState({ context, state: 0 });
      return;
    }

    if (action === ACTIONS.PRESET) {
      XSplit.getActivePreset(settings.sceneId).then((presetId) => {
        const state = Number(settings.presetId === presetId);
        toggleState({ context, state });
      });
      return;
    }
  });
};

const onPropInspectorHandler = () => {
  // TRACKS CURRENTLY SELECTED PROPERTY INSPECTOR
  Plugin.on(EVENTS.PI.APPEAR, ({ action, context }) => {
    console.log(context);
    const item = getActionContext(action, context);

    if (!item) {
      return;
    }

    State.setActivePI(action, context);
  });

  Plugin.on(
    EVENTS.FROM.PROPERTY_INSPECTOR,
    async ({ action, context, payload: { event, ...payload } }) => {
      console.warn(event, payload);
      switch (event) {
        case EVENTS.GET.ALL_SCENES:
          Plugin.sendToPropertyInspector({
            action,
            context,
            payload: {
              event,
              scenes: getScenesList(),
            },
          });
          break;
        case EVENTS.GET.SCENE_SOURCES:
          Plugin.sendToPropertyInspector({
            action,
            context,
            payload: {
              event,
              sources: await getSceneSources(payload.sceneId),
            },
          });
          break;
        case EVENTS.GET.SCENE_PRESETS:
          Plugin.sendToPropertyInspector({
            action,
            context,
            payload: {
              event,
              presets: await getScenePresets(payload.sceneId),
            },
          });
          break;
        default:
      }
    },
  );
};

export const subscribeToEvents = once(() => {
  onSettingsChange();
  onPropInspectorHandler();
});

export const onXSplitConnect = async () => {
  await getState();

  await getAllList();

  await onXSplitEvents();
};
