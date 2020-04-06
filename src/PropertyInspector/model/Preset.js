import produce from 'immer';
import Base from './Base';

export default class extends Base {
  state = {
    sceneId: '',
    scenesList: [],

    presetId: '',
    presetList: [],
  };

  persist = ['sceneId', 'presetId'];
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

  setPresetId = async (id) => {
    await this.setState(
      produce((draft) => {
        draft.presetId = id;
      }),
    );

    this.save();
  };

  setPresetList = async (list) => {
    await this.setState(
      produce((draft) => {
        draft.presetList = list;
      }),
    );
  };
}
