import produce from 'immer';
import Base from './Base';

export default class extends Base {
  state = {
    id: '',
    name: '',
    list: [],
  };

  persist = ['id', 'name'];
  required = ['id', 'name'];

  setList = async (list) => {
    await this.setState(
      produce((draft) => {
        draft.list = list;
      }),
    );
  };

  setOutput = async (output) => {
    await this.setState(
      produce((draft) => {
        Object.assign(draft, output);
      }),
    );

    this.save();
  };
}
