import  * as effectTypes from './effectTypes';
import proc from './proc';
import * as is from './is';

function runTakeEffect(env, {channel = env.channel, pattern}, cb) {
  const matcher = (input) => input.type === pattern;
  channel.take(cb, matcher);
}

function runPutEffect(env, {action}, cb) {
  console.log('runPutEffect ');
  const result = env.dispatch(action);
  cb(result);
}

function runCallEffect(env, {fn, args}, cb) {
  console.log('runCallEffect ');
  const result =  fn.apply(null, args);
  if(is.promise(result)) {
    result.then((data) => {
      cb(data);
    }).catch((err) => {
      cb(err, true);
    })
    return;
  }
  if(is.iterator(result)) {
    proc(env, result, cb);
    return;
  }
  cb(result);
}

function runForkEffect(env, {fn, args}, cb) {
  console.log('runForkEffect');
  const taskIterator = fn.apply(null, args);
  proc(env, taskIterator);
  cb();
}

function runAllEffect(env, effects, cb) {
  console.log('runAllEffect');
  const len = effects.length;
  for (let i = 0; i < len; i++) {
    proc(env, effects[i]);
  }
  cb();
}

const effectRunnerMap = {
  [effectTypes.TAKE]: runTakeEffect,
  [effectTypes.PUT]: runPutEffect,
  [effectTypes.CALL]: runCallEffect,
  [effectTypes.FORK]: runForkEffect,
  [effectTypes.ALL]: runAllEffect,
}

export default effectRunnerMap;