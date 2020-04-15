const UUID =
  process.env.NODE_ENV !== 'production' ? 'com.dev.xsplit.streamdeck' : 'com.xsplit.streamdeck';

export default {
  SCENE: `${UUID}.scene`,
  SOURCE: `${UUID}.source`,
  PRESET: `${UUID}.preset`,
  RECORD: `${UUID}.record`,
  OUTPUT: `${UUID}.output`,
  SCREENSHOT: `${UUID}.screenshot`,
  MICROPHONE: `${UUID}.microphone`,
  SPEAKER: `${UUID}.speaker`,
};
