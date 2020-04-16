import { launched$, connectionState$ } from 'utils/connect/XSplitConnect';

export const CONNECTION_STATE = {
  XSPLIT_NOT_FOUND: 1,
  CONNECTING: 2,
  CONNECTED: 3,
};

const connectionState = () => {
  if (!launched$.getValue()) {
    return CONNECTION_STATE.XSPLIT_NOT_FOUND;
  }

  if (!connectionState$.getValue()) {
    return CONNECTION_STATE.CONNECTING;
  }

  return CONNECTION_STATE.CONNECTED;
};

export default connectionState;
