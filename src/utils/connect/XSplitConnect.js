import connect from "streamdeck-xsplit-connect";
import XSplitHandler from "handlers/XSplit";
import { toString } from "utils/function";
import { Subject, of } from "rxjs";
import { delay } from "rxjs/operators";

export const connectionState$ = new Subject(false);

const connectToXSplit = () =>
  new Promise(resolve => {
    const onMessage = ({ data }) => {
      try {
        const { event, payload } = JSON.parse(data);

        XSplitHandler.onPayload(event, payload);
      } catch (e) {
        console.error(e);
      }
    };

    connect([55511, 55512, 55513], {
      onOpen: channel => {
        console.warn("RTC Connected");
        XSplitHandler.send = data => channel.send(toString(data));
        connectionState$.next(true);

        channel.onclose = () => connectionState$.next(false);
        channel.onerror = () => connectionState$.next(false);
      },

      onError: () => console.error("WebSocker Error"),
      onClose: () => console.error("WebSocker Closed"),
      onMessage
    }).then(resolve);
  });

connectionState$.subscribe(state => {
  if (!state) {
    of("")
      .pipe(delay(3000))
      .subscribe(() => {
        connectToXSplit();
      });
    return;
  }
});

export default connectToXSplit;
