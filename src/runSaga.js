import proc from "./proc";

export default function runSaga({channel, dispatch, getState}, saga, ...args) {
  const iterator = saga(...args);
  const env = {
    dispatch,
    getState,
    channel
  }
  proc(env, iterator);
}