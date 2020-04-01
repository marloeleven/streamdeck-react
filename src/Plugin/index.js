import { useEffect, useState } from 'react';
import Plugin from 'handlers/Plugin';
import XSplit from 'handlers/XSplit';
import ActionsList, { ACTIONS } from 'handlers/ActionsListHandler';

import EVENTS from 'const/events';

import { SDConnect } from 'utils/connect';

import useXSplit from 'hooks/useXSplit';

import { toggleSceneState, toggleState, toggleSourceState } from './actions';

const { SUBSCRIPTION_EVENTS: SUBSCRIPTION } = EVENTS.XSPLIT;

// @DEBUG
window.Plugin = Plugin;
window.XSplit = XSplit;
window.ActionsList = ActionsList;

const handleEvent = ({ action, context, settings }) => {
  switch (action) {
    case ACTIONS.SCENE:
      XSplit.setActiveScene(settings).catch(() => {
        Plugin.showAlert({ context });
      });
      break;
    case ACTIONS.SOURCE:
      // @TODO validate
      XSplit.getSourceState(settings.sceneId, settings.sourceId).then(({ state }) => {
        XSplit.setSourceState({ ...settings, state: (Number(state) + 1) % 2 }).catch(() => {
          Plugin.showAlert({ context });
        });
      });
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
    SDConnect(Plugin);
  }, []);

  useEffect(() => {
    if (isConnected) {
      console.warn('Plugin RTC Connected');

      Plugin.on(EVENTS.PLUGIN.KEY_UP, ({ action, context, payload: { settings } }) =>
        handleEvent({ action, context, settings }),
      );

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

      XSplit.getActiveScene().then(({ id }) => toggleSceneState(id));

      XSplit.on(SUBSCRIPTION.SCENE_CHANGE, ({ id }) => toggleSceneState(id));
      XSplit.on(SUBSCRIPTION.SOURCE_VISIBILIY, ({ sceneId, sourceId, state }) =>
        toggleSourceState(sceneId, sourceId, state),
      );
    }
  }, [isConnected]);

  return null;
};
