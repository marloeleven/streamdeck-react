import produce from 'immer';
import Base from './Base';

export default class extends Base {
  state = {
    id: '',
    name: '',
    list: [],
  };

  persist = ['id', 'name'];

  setList = async list => {
    await this.setState(
      produce(draft => {
        draft.list = list;
      }),
    );
  };

  setScene = async scene => {
    await this.setState(
      produce(draft => {
        Object.assign(draft, scene);
      }),
    );

    this.save();
  };
}
