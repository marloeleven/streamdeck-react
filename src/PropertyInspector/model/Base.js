import { Container } from 'unstated';
import pick from 'lodash/pick';
import throttle from 'lodash/throttle';

import handler from 'handlers/PropertyInspector';

const throttledSave = throttle(
  settings => {
    console.warn('SAVE', settings);
    handler.setSettings(settings);
  },
  250,
  {
    leading: false,
    trailing: true,
  },
);

export default class extends Container {
  save = () => {
    const settings = pick(this.state, this.persist);

    throttledSave(settings);
  };
}
