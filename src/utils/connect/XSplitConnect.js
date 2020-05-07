import XSplit, { EVENTS } from 'streamdeck-xsplit-connect';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';

export const launched$ = new BehaviorSubject(false);
export const connectionState$ = new BehaviorSubject(false);

XSplit.on(EVENTS.CONNECT, () => connectionState$.next(true));
XSplit.on(EVENTS.DISCONNECT, () => connectionState$.next(false));

launched$.pipe(distinctUntilChanged()).subscribe((isXSplitOpen) => {
  console.warn('lauched', isXSplitOpen);
  if (isXSplitOpen) {
    XSplit.connect();
  }

  XSplit.disconnect();
});

connectionState$.pipe(filter(() => launched$.getValue())).subscribe((isConnected) => {
  console.warn('isConnected', isConnected);
  if (isConnected) {
    return;
  }

  XSplit.connect();
});
