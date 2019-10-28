import { FUNCTION, NUMBER, STRING, OBJECT } from 'const/utils';

export const isString = e => typeof e === STRING;
export const isNumber = e => typeof e === NUMBER;
export const isFunction = e => typeof e === FUNCTION;
export const isObject = e => typeof e === OBJECT;

export const noop = e => e;

export const parse = string => {
  try {
    return JSON.parse(string);
  } catch (e) {
    return {};
  }
};
