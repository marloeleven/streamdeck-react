const EVENTS = {
  SUBSCRIPTION: 'SUBSCRIPTION',
  ACTIVATE: 'ACTIVATE',
  TO: {
    PLUGIN: 'sendToPlugin',
    PROPERTY_INSPECTOR: 'sendToPropertyInspector',
  },
  FROM: {
    PLUGIN: 'sendToPropertyInspector',
    PROPERTY_INSPECTOR: 'sendToPlugin',
  },
  GET: {
    SETTINGS: 'getSettings',
    GLOBAL_SETTINGS: 'getGlobalSettings',
    // handler events
    ALL_SCENES: 'getAllScenes',
    SCENE_SOURCES: 'getSceneSources',
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
    DISAPPEAR: 'propertyInspectorDidDisappear',
    WILL_APPEAR: 'willAppear',
    WILL_DISAPPEAR: 'willDisappear',
  },
  PLUGIN: {
    SEND: 'sendToPlugin',
    RECEIVE_FROM_PI: 'sendToPlugin',
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
      RECORDING: {
        STATE: 'getRecordingState',
      },
      MICROPHONE: {
        STATE: 'getMicrophoneState',
      },
      SPEAKER: {
        STATE: 'getSpeakerState',
      },
      OUTPUTS: 'getAllOutputs',
    },
    SET: {
      SOURCE_STATE: 'setSourceState',
      ACTIVE_SCENE: 'setActiveScene',
    },
    TOGGLE: {
      SOURCE_STATE: 'toggleSourceState',
      RECORD_STATE: 'toggleRecordingState',
      MICROPHONE_STATE: 'toggleMicrophoneState',
      SPEAKER_STATE: 'toggleSpeakerState',
    },
    DO: {
      SCREENSHOT: 'doScreenshot',
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
      RECORDING_STATE: 'recordingstate',
      MICROPHONE_STATE: 'microphonestate',
      SPEAKER_STATE: 'speakerstate',
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
