import connect from 'streamdeck-xsplit-connect';
import XSplitHandler from 'handlers/XSplit';
import { toString, parse } from 'utils/function';
import { BehaviorSubject, combineLatest } from 'rxjs';

export const connectionState$ = new BehaviorSubject(false);
export const launched$ = new BehaviorSubject(false);

const connectToXSplit = () => {
  const onMessage = ({ data }) => {
    try {
      const { event, payload } = parse(data);

      XSplitHandler.onPayload(event, payload);
    } catch (e) {
      console.error(e);
    }
  };

  connect(
    [55511, 55512, 55513],
    {
      onOpen: (channel) => {
        XSplitHandler.send = (data) => {
          try {
            channel.send(toString(data));
          } catch (e) {
            channel.close();
          }
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
    },
    () => launched$.getValue(),
  );
};
combineLatest(launched$, connectionState$).subscribe(([launched, state]) => {
  if (launched && !state) {
    connectToXSplit();
  }
});

export default connectToXSplit;
