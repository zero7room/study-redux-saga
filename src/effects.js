import { IO } from "./symbols";
import * as effectTypes from "./effectTypes";
const makeEffect = (type, payload) => ({ [IO]: IO, type, payload });

export function take(pattern) {
  return makeEffect(effectTypes.TAKE, { pattern });
}

export function put(action) {
  return makeEffect(effectTypes.PUT, { action });
}

export function call(fn, ...args) {
  return makeEffect(effectTypes.CALL, { fn, args });
}

export function fork(fn, ...args) {
  return makeEffect(effectTypes.FORK, { fn, args });
}

export function all(effects) {
  return makeEffect(effectTypes.ALL, effects);
}
