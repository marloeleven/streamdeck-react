const EVENTS = {
  ACTIVATE: 'ACTIVATE',
  GET: {
    SCENES: 'getAllScenes',
    ACTIVE_SCENE: 'getActiveScene',
    SETTINGS: 'getSettings',
    GLOBAL_SETTINGS: 'getGlobalSettings',
  },
  SET: {
    ACTIVE_SCENE: 'setActiveScene',
    SETTINGS: 'setSettings',
    GLOBAL_SETTINGS: 'setGlobalSettings',
    TITLE: 'setTitle',
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
  },
  PLUGIN: {
    SEND: 'sendToPlugin',
    KEY_UP: 'keyUp',
    KEY_DOWN: 'keyDown',
  },
  OPEN_URL: 'openUrl',
  LOG_MESSAGE: 'logMessage',
  WILL_APPEAR: 'willAppear',
};

//
export const PLUGIN_ACTION_EVENT = [
  EVENTS.PLUGIN.KEY_UP,
  EVENTS.PLUGIN.KEY_DOWN,
];

// events that only exist on plugin
export const PLUGIN_EVENTS = [EVENTS.SET.TITLE, EVENTS.PLUGIN.SEND];

// events that exist on both plugin and prop inspector
export const GLOBAL_EVENTS = [EVENTS.GET.SETTINGS, EVENTS.SET.SETTINGS];

export default EVENTS;
