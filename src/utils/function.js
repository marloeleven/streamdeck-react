import isString from 'lodash/fp/isString';
import isObject from 'lodash/fp/isObject';
import isNumber from 'lodash/fp/isNumber';
import isFunction from 'lodash/fp/isFunction';

export { isString, isObject, isNumber, isFunction };

export const noop = e => e;

export const parse = stringedJson => {
  if ([null, undefined].includes(stringedJson)) {
    return {};
  }

  if (isObject(stringedJson)) {
    return stringedJson;
  }

  try {
    if (isString(stringedJson)) {
      return JSON.parse(stringedJson);
    }

    throw new Error(`value not a String. ${toString(stringedJson)}`);
  } catch (e) {
    throw new Error(e);
  }
};

export const toString = jsonObject => {
  if (typeof jsonObject === 'string') {
    return jsonObject;
  }

  try {
    return JSON.stringify(jsonObject);
  } catch (e) {
    throw new Error('Unknown object type', jsonObject);
  }
};
