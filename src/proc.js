import { IO } from "./symbols";
import effectRunnerMap from "./effectRunnermap";

export default function proc(env, iterator, cb) {
  next();

  function next(arg, isErr) {
    let result;
    if(isErr) {
      result = iterator.throw(arg);
    } else {
      result = iterator.next(arg)
    }
    if (!result.done) {
      // 遍历没有结束
      digestEffect(result.value, next)
    } else {
      if (typeof cb === 'function') {
        cb(result.value)
      }
    }
  }
  function runEffect(effect, currCb) {
    if (effect && effect[IO]) {
      const effectRunner = effectRunnerMap[effect.type];
      effectRunner(env, effect.payload, currCb)
    } else {
      currCb();
    }
  } 
  function digestEffect(effect, cb) {
    let effectSettled;
    function currCb(res, isErr) {
      if(effectSettled) return;
      effectSettled = true;
      cb(res, isErr);
    }
    runEffect(effect, currCb)
  }
}
