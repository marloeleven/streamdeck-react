import { useEffect, useState } from 'react';
import Plugin from 'handlers/Plugin';
import XSplit from 'handlers/XSplit';
import ActionsList from 'handlers/ActionsListHandler';

import EVENTS from 'const/events';
import ACTIONS from 'const/actions';

import { SDConnect } from 'utils/connect';

import useXSplit from 'hooks/useXSplit';

import { toggleMicrophoneState, toggleSpeakerState } from './actions';
import stateHandler from './state';

// @DEBUG
window.Plugin = Plugin;
window.XSplit = XSplit;
window.ActionsList = ActionsList;

const handleKeyUp = ({ action, context, settings }) => {
  const showAlert = () => Plugin.showAlert({ context });
  switch (action) {
    case ACTIONS.SCENE:
      XSplit.setActiveScene(settings).catch(showAlert);
      break;
    case ACTIONS.SOURCE:
      XSplit.toggleSourceState(settings).catch(showAlert);
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

export default () => {
  const [isConnected, setIsConnected] = useState(false);

  useXSplit(setIsConnected);

  useEffect(() => {
    SDConnect(Plugin).then(() => {
      Plugin.on(EVENTS.PLUGIN.KEY_UP, ({ action, context, payload: { settings } }) =>
        handleKeyUp({ action, context, settings }),
      );
    });
  }, []);

  useEffect(() => {
    if (isConnected) {
      console.warn('Plugin RTC Connected');
      stateHandler();
    }
  }, [isConnected]);

  return null;
};
