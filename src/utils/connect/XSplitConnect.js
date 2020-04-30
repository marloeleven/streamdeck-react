import connect from 'streamdeck-xsplit-connect';
import XSplitHandler from 'handlers/XSplit';
import { toString, parse } from 'utils/function';
import { BehaviorSubject, Subject, combineLatest, fromEvent, of } from 'rxjs';
import { merge, delay, takeWhile, filter, distinctUntilChanged } from 'rxjs/operators';
import { clearPing } from 'handlers/AsyncRequest';
import throttle from 'lodash/throttle';

export const connectionState$ = new BehaviorSubject(false);
export const launched$ = new BehaviorSubject(false);

export const ping$ = new Subject();

ping$.pipe(filter(() => connectionState$.getValue())).subscribe(() => {
  XSplitHandler.ping().catch(() => {
    if (connectionState$.getValue()) {
      connectionState$.next(false);
    }
  });
});

const sendPing = throttle(() => ping$.next(), 3000, {
  leading: false,
  trailing: true,
});

const connectToXSplit = () => {
  console.warn('CONNECTING');
  const onMessage = ({ data }) => {
    try {
      const { event, payload } = parse(data);

      sendPing();
      XSplitHandler.onPayload(event, payload);
    } catch (e) {
      console.error(e);
    }
  };

  return connect(
    [55511, 55512, 55513],
    {
      onOpen: (channel) => {
        XSplitHandler.send = (data) => {
          try {
            sendPing();
            channel.send(toString(data));
          } catch (e) {
            if (channel.readyState !== 'closed') {
              channel.close();
            }
          }
        };
        connectionState$.next(true);

        channel.onmessage = onMessage;

        fromEvent(channel, 'close')
          .pipe(merge(fromEvent(channel, 'error')), delay(3000))
          .subscribe(() => {
            connectionState$.next(false);
          });

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
  ).then((websocket) => {
    /*
      catches issue with sudden XJS extension closing
      RTC disconnection fires but local web socket server is still opened
    */
    of('')
      .pipe(
        delay(3000),
        takeWhile(() => !connectionState$.getValue()),
      )
      .subscribe(() => {
        websocket.close();
        connectionState$.next(false);
      });
  });
};

combineLatest(launched$, connectionState$)
  .pipe(
    distinctUntilChanged(),
    filter(() => connectionState$.getValue() === false),
  )
  .subscribe(([launched, state]) => {
    if (launched && !state) {
      clearPing();
      connectToXSplit();
    }
  });
