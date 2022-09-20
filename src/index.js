import runSaga from "./runSaga";
import { stdChannel } from "./channel";

export default function createSagaMiddleware() {
  let boundRunSaga;
  let channel = stdChannel();
  function sagaMiddleWare({ getState, dispatch }) {
    boundRunSaga = runSaga.bind(null, {
      channel,
      getState,
      dispatch,
    });
    return (next) => (action) => {
      let result = next(action);
      channel.put(action);
      return result;
    };
  }
  sagaMiddleWare.run = (...args) => boundRunSaga(...args);
  return sagaMiddleWare;
}
