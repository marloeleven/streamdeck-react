import { Container } from 'unstated';
import pick from 'lodash/pick';
import { Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

import handler from 'handlers/PropertyInspector';

const save$ = new Subject();

save$.pipe(throttleTime(250)).subscribe(settings => {
  console.warn('SAVE ACCEPTED!', settings);
  handler.setSettings(settings);
});

const valueNotEmpty = value => value !== '';

export default class extends Container {
  save = () => {
    const settings = pick(this.state, this.persist);

    if (Object.values(settings).every(valueNotEmpty)) {
      save$.next(settings);
      return;
    }
  };
}
