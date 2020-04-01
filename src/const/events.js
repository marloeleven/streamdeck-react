const EVENTS = {
  SUBSCRIPTION: 'SUBSCRIPTION',
  ACTIVATE: 'ACTIVATE',
  GET: {
    SETTINGS: 'getSettings',
    GLOBAL_SETTINGS: 'getGlobalSettings',
  },
  SET: {
    SETTINGS: 'setSettings',
    GLOBAL_SETTINGS: 'setGlobalSettings',
    TITLE: 'setTitle',
    STATE: 'setState',
    SHOW_ALERT: 'showAlert',
    SHOW_OK: 'showOk',
  },
  RECEIVE: {
    SCENES: 'scenesList',
    SETTINGS: 'didReceiveSettings',
    GLOBAL_SETTINGS: 'didReceiveGlobalSettings',
  },
  PI: {
    INIT: 'INIT',
    SEND: 'sendToPropertyInspector',
    APPEAR: 'propertyInspectorDidAppear',
    WILL_APPEAR: 'willAppear',
    WILL_DISAPPEAR: 'willDisappear',
  },
  PLUGIN: {
    SEND: 'sendToPlugin',
    KEY_UP: 'keyUp',
    KEY_DOWN: 'keyDown',
  },
  XSPLIT: {
    GET: {
      SCENE: {
        ALL: 'getAllScenes',
        ACTIVE: 'getActiveScene',
      },
      SOURCE: {
        ALL: 'getSceneSources',
        STATE: 'getSourceState',
      },
      OUTPUTS: 'getAllOutputs',
    },
    SET: {
      SOURCE_STATE: 'setSourceState',
      ACTIVE_SCENE: 'setActiveScene',
    },
    RECEIVE: {
      SCENES: 'scenesList',
    },
    SUBSCRIPTION_EVENTS: {
      SCENE_CHANGE: 'scenechange',
      SCENES_LIST: 'sceneslist',
      SOURCE_VISIBILIY: 'sourcevisibility',
      SOURCE_COUNT: 'sourcecount',
      OUTPUTS_LIST: 'outputslist',
    },
  },
  OPEN_URL: 'openUrl',
  LOG_MESSAGE: 'logMessage',
};

//
export const PLUGIN_ACTION_EVENT = [EVENTS.PLUGIN.KEY_UP, EVENTS.PLUGIN.KEY_DOWN];

// events that only exist on plugin
export const PLUGIN_EVENTS = [EVENTS.SET.TITLE, EVENTS.PLUGIN.SEND];

// events that exist on both plugin and prop inspector
export const GLOBAL_EVENTS = [EVENTS.GET.SETTINGS, EVENTS.SET.SETTINGS];

export default EVENTS;
