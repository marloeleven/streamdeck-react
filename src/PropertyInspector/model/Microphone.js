import produce from 'immer';
import Base from './Base';

export default class extends Base {
  state = {
    pushToTalk: 0,
  };

  persist = ['pushToTalk'];
  required = ['pushToTalk'];

  setPushToTalk = async (state) => {
    await this.setState(
      produce((draft) => {
        draft.pushToTalk = state;
      }),
    );

    this.save();
  };
}
