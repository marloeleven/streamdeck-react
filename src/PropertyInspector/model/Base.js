import { Container } from 'unstated';
import pick from 'lodash/pick';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import handler from 'handlers/PropertyInspector';

const save$ = new Subject();

save$.pipe(debounceTime(250)).subscribe((settings) => {
  console.warn('SAVE ACCEPTED!', settings);
  handler.setSettings(settings);
});

const valueNotEmpty = (value) => value !== '';

export default class extends Container {
  persist = [];
  required = [];

  _validateInputs = (settings) => {
    const requried = pick(settings, this.required);

    return requried.length ? requried.every(valueNotEmpty) : true;
  };

  save = () => {
    const settings = pick(this.state, this.persist);

    if (this._validateInputs(settings)) {
      save$.next(settings);
      return;
    }
  };
}
