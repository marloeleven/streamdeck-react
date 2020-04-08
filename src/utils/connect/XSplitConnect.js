import connect from 'streamdeck-xsplit-connect';
import XSplitHandler from 'handlers/XSplit';
import { toString, parse } from 'utils/function';
import { Subject, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export const connectionState$ = new Subject(false);

const connectToXSplit = () => {
  const onMessage = ({ data }) => {
    try {
      const { event, payload } = parse(data);

      XSplitHandler.onPayload(event, payload);
    } catch (e) {
      console.error(e);
    }
  };

  connect([55511, 55512, 55513], {
    onOpen: (channel) => {
      console.warn('connected', channel);
      XSplitHandler.send = (data) => {
        channel.send(toString(data));
      };
      connectionState$.next(true);

      channel.onmessage = onMessage;
      channel.onclose = () => {
        connectionState$.next(false);
      };
      channel.onerror = (err) => {
        connectionState$.next(false);
      };

      window.addEventListener('beforeunload', () => {
        channel.close();
      });
    },
    onError: (err, websocket) => {
      websocket.close();
      connectionState$.next(false);
    },
  });
};

connectionState$.subscribe((state) => {
  if (!state) {
    of('').pipe(delay(3000)).subscribe(connectToXSplit);
    return;
  }
});

export default connectToXSplit;
