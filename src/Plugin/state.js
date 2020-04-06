const updateMap = (oldMap, array, setValue) => {
  const newMap = new Map();

  array.forEach((item) => {
    const { id } = item;
    if (oldMap.has(id)) {
      const oldValue = oldMap.get(id);
      if (oldValue instanceof Scene) {
        Object.assign(oldValue, item);
      }

      newMap.set(id, oldValue);
      return;
    }

    newMap.set(id, setValue(item));
  });

  return newMap;
};

class Scene {
  constructor({ id, name }) {
    this.id = id;
    this.name = name;
    this.sources = new Map();
    this.presets = [];
  }

  //{ id, name }[]
  addSources(sources) {
    this.sources = updateMap(this.sources, sources, (source) => source);

    return this;
  }

  //{ id, name }
  updateSource(source) {
    if (this.sources.has(source.id)) {
      this.sources.set(source.id, source);
    }

    return this;
  }

  deleteSource(id) {
    if (this.sources.has(id)) {
      this.sources.delete(id);
    }

    return this;
  }

  // id[]
  setPresets(presets) {
    this.presets = presets;
    return this;
  }

  deletePreset(id) {
    this.presets = this.presets.filter((presetId) => presetId !== id);

    return this;
  }
}

class State {
  constructor() {
    this.activePI = {
      action: '',
      context: '',
    };
    this.scenesList = new Map();
  }

  setActivePI(action, context) {
    Object.assign(this.activePI, { action, context });

    return this;
  }

  isActivePi(action, context) {
    return this.activePI.action === action && this.activePI.context === context;
  }

  // { id, name }
  async addScene(scene) {
    this.scenesList.set(scene.id, new Scene(scene));
    return this.scenesList.get(scene.id);
  }

  async getScene(id) {
    if (this.scenesList.has(id)) {
      return this.scenesList.get(id);
    }

    return Promise.reject();
  }

  async removeScene(id) {
    if (this.scenesList.has(id)) {
      return this.scenesList.delete(id);
    }
  }

  sceneExist(id) {
    return this.scenesList.has(id);
  }

  // update scenes list
  async updateList(scenes) {
    this.scenesList = updateMap(this.scenesList, scenes, (scene) => new Scene(scene));
  }
}

export default new State();

// will appear
/*
  State.addScene(scene)

  State.getScene(sceneId).then(scene => {
    scene.addSources(sources);
    scene.setPresets(presets);
  })

  // update

  State.getScene(sceneId).then(scene => {
    scene.updateSource()
  })

  // remove
  State.getScene(sceneId).then(scene => {
    scene.deleteSource()
    scene.deletePreset()
  })
*/
