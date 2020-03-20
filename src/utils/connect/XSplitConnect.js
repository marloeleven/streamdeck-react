import connect from "streamdeck-xsplit-connect";
import XSplitHandler from "handlers/XSplit";
import { toString } from "utils/function";
import { Subject } from "rxjs";

export const xsplitConnect$ = new Subject(false);

export default () =>
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
        XSplitHandler.send = data => channel.send(toString(data));
        xsplitConnect$.next(true);
      },
      onError: () => xsplitConnect$.next(false),
      onClose: () => xsplitConnect$.next(false),
      onMessage
    }).then(resolve);
  });
