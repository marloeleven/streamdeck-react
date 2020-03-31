export const ACTIONS = {
  SCENE: 'com.xsplit.streamdeck.scene',
  SOURCE: 'com.xsplit.streamdeck.source',
  RECORD: 'com.xsplit.streamdeck.record',
  OUTPUT: 'com.xsplit.streamdeck.output',
};

class ActionsList {
  constructor() {
    this.list = Object.values(ACTIONS).reduce((obj, value) => {
      obj[value] = {};
      return obj;
    }, {});

    /*
      list = {

        [action] - com.xsplit.streamdeck.scene
          {
            [context]: 20B83F06012CDF515353D414F8643BF9
              {} // whole response object
          }
      }

    */
  }

  getList(ACTION) {
    return this.list[ACTION];
  }

  add(list, settings) {
    list[settings.context] = settings;
  }

  remove(list, { context }) {
    delete list[context];
  }
}

export default new ActionsList();
