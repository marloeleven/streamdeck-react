import once from 'lodash/fp/once';

import Plugin from 'handlers/Plugin';
import XSplit from 'handlers/XSplit';

import EVENTS from 'const/events';
import ACTIONS from 'const/actions';

import {
  toggleSceneState,
  toggleState,
  getSourceState,
  toggleSourceState,
  toggleRecordingState,
  toggleMicrophoneState,
  toggleSpeakerState,
} from './actions';

const { SUBSCRIPTION_EVENTS: SUBSCRIPTION } = EVENTS.XSPLIT;

// ON CONNECT GET CURRENT STATE
const getState = () => {
  XSplit.getActiveScene().then(({ id }) => toggleSceneState(id));

  getSourceState();

  XSplit.getRecordingState().then(({ state }) => toggleRecordingState(state));

  XSplit.getMicrophoneState().then(({ state }) => toggleMicrophoneState(state));
  XSplit.getSpeakerState().then(({ state }) => toggleSpeakerState(state));
};

// SUBSCRIBE TO XSPLIT EVENTS
const onXSplitEvents = () => {
  XSplit.on(SUBSCRIPTION.SCENE_CHANGE, ({ id }) => toggleSceneState(id));

  XSplit.on(SUBSCRIPTION.SOURCE_VISIBILIY, ({ sceneId, sourceId, state }) =>
    toggleSourceState(sceneId, sourceId, state),
  );

  XSplit.on(SUBSCRIPTION.RECORDING_STATE, ({ state }) => {
    toggleRecordingState(state);
  });

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
      XSplit.getSourceState(settings.sceneId, settings.sourceId).then(({ state }) => {
        toggleState({ context, state });
      });
      return;
    }
  });
};

const subscribeToEvents = once(() => {
  console.log('subscribeToEvents');
  onXSplitEvents();
  onSettingsChange();
});

export default () => {
  console.log('STATE INIT!');
  // call everytime connection state changes
  getState();

  // called only once!
  subscribeToEvents();
};
