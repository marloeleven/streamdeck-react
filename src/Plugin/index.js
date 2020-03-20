import { useEffect, useState } from "react";
import Plugin from "handlers/Plugin";
import XSplit from "handlers/XSplit";

import EVENTS from "const/events";

import { SDConnect } from "utils/connect";

import useXSplit from "hooks/useXSplit";

export default () => {
  const [isConnected, setIsConnected] = useState(true); // DEBUG

  useXSplit({ isConnected, setIsConnected });

  useEffect(() => {
    SDConnect(Plugin).then(() => {
      Plugin.on(EVENTS.PLUGIN.KEY_UP, ({ settings }) =>
        XSplit.setActiveScene(settings)
      );
    });
  }, []);

  return null;
};
