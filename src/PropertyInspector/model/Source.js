import produce from 'immer';
import Base from './Base';

export default class extends Base {
  state = {
    sceneId: '',
    scenesList: [],

    sourceId: '',
    sourceList: [],

    toggleLinked: false,
  };

  persist = ['sceneId', 'sourceId', 'toggleLinked'];
  required = ['sceneId'];

  setSceneId = async (id) => {
    await this.setState(
      produce((draft) => {
        draft.sceneId = id;
      }),
    );

    this.save();
  };

  setScenesList = async (list) => {
    await this.setState(
      produce((draft) => {
        draft.scenesList = list;
      }),
    );
  };

  setSourceId = async (id) => {
    await this.setState(
      produce((draft) => {
        draft.sourceId = id;
      }),
    );

    this.save();
  };

  setSourceList = async (list) => {
    await this.setState(
      produce((draft) => {
        draft.sourceList = list;
      }),
    );
  };

  setToggleLinked = async (bool) => {
    await this.setState(
      produce((draft) => {
        draft.toggleLinked = bool;
      }),
    );

    this.save();
  };
}
