import { useEffect, useState } from 'react';
import Plugin from 'handlers/Plugin';
import XSplit from 'handlers/XSplit';
import ActionsList from 'handlers/ActionsListHandler';

import EVENTS from 'const/events';

import { SDConnect } from 'utils/connect';

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
      subscribeToEvents();
    });
  }, []);

  useEffect(() => {
    if (isConnected) {
      console.warn('Plugin RTC Connected');
      onXSplitConnect();
    }
  }, [isConnected]);

  return null;
};
