import { useEffect, useState } from 'react';
import Plugin from 'handlers/Plugin';
import XSplit from 'handlers/XSplit';
import ActionsList from 'handlers/ActionsListHandler';

import EVENTS from 'const/events';

import { SDConnect } from 'utils/connect';
import connectToXSplit, { launched$ } from 'utils/connect/XSplitConnect';

import useXSplit from 'hooks/useXSplit';

import { handleKeyUp } from './actions';
import { subscribeToEvents, onXSplitConnect } from './handler';

import State from './state';

// @DEBUG
window.Plugin = Plugin;
window.XSplit = XSplit;
window.ActionsList = ActionsList;
window.State = State;

export default () => {
  const [isConnected, setIsConnected] = useState(false);

  useXSplit(setIsConnected);

  useEffect(() => {
    SDConnect(Plugin).then(() => {
      Plugin.on(EVENTS.PLUGIN.KEY_UP, handleKeyUp);

      Plugin.on(EVENTS.PLUGIN.APP_LAUNCH, () => launched$.next(true));

      Plugin.on(EVENTS.PLUGIN.APP_TERMINATE, () => launched$.next(false));

      subscribeToEvents();
    });

    connectToXSplit();
  }, []);

  useEffect(() => {
    if (isConnected) {
      onXSplitConnect();
    }
  }, [isConnected]);

  return null;
};
