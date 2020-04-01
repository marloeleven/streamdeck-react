import isString from 'lodash/fp/isString';
import isObject from 'lodash/fp/isObject';
import isNumber from 'lodash/fp/isNumber';
import isFunction from 'lodash/fp/isFunction';

export { isString, isObject, isNumber, isFunction };

export const noop = e => e;

export const parse = stringedJson => {
  if (isObject(stringedJson)) {
    // @ts-ignore
    return stringedJson;
  }

  try {
    if (isString(stringedJson)) {
      return JSON.parse(stringedJson);
    }

    throw Error(`value not a String. ${toString(stringedJson)}`);
  } catch (e) {
    throw Error(e);
  }
};

export const toString = jsonObject => {
  if (typeof jsonObject === 'string') {
    return jsonObject;
  }

  try {
    return JSON.stringify(jsonObject);
  } catch (e) {
    throw Error('Unknown object type', jsonObject);
  }
};
