import { useEffect } from "react";
import handler from "handlers/Plugin";

import EVENTS from "const/events";

import { connect } from "handlers/SDConnect";
import XSplit from "utils/xsplit";

export default () => {
  useEffect(() => {
    connect(handler).then(() => {
      handler.on(EVENTS.PLUGIN.KEY_UP, ({ settings }) =>
        XSplit.setActiveScene(settings)
      );
    });
  }, []);

  return null;
};
