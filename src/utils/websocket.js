import { noop } from 'utils/function';

const defaultHandler = {
  message: noop,
  close: noop,
  open: noop,
  error: noop,
};

export default {
  connect({ port, handler = defaultHandler }) {
    const websocket = new WebSocket(`ws://127.0.0.1:${port}`);

    websocket.addEventListener('open', handler.open);
    websocket.addEventListener('close', handler.close);
    websocket.addEventListener('message', handler.message);
    websocket.addEventListener('error', handler.error);

    return websocket;
  },
};
