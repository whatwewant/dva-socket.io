/**
* @Author: eason
* @Date:   2017-07-20T14:16:57+08:00
* @Email:  uniquecolesmith@gmail.com
 * @Last modified by:   zero
 * @Last modified time: 2017-07-28T11:33:17+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/
import invariant from 'invariant';
import io from 'socket.io-client';

export function createMiddleware(url, options, rules, ref_io) {
  const socket = ref_io ? ref_io(url, options) : io(url, options);

  return ({ dispatch, getState }) => {
    const listeners = createListeners({ dispatch, getState, socket }, rules.on);
    listeners.forEach(([event, listener]) => socket.on(event, listener));

    return next => (action) => {
      const emitters = createEmiters({ dispatch, getState, socket }, action, rules.emit);
      const asyncs = createAsyncs({ dispatch, getState, socket }, action, rules.asyncs);

      emitters.forEach(([event, evaluate, data, callback]) => {
        if (evaluate()) {
          socket.emit(event, data(), callback);
        }
      });

      asyncs.forEach(([evaluate, request]) => {
        if (evaluate()) {
          request();
        }
      });

      return next(action);
    };
  };
}

export function createListeners({ dispatch, getState, socket }, listeners = {}) {
  invariant(
    ['[object Object]', '[object Array]'].includes(Object.prototype.toString.call(listeners)),
    'createListeners: listeners should be an object or an array!',
  );

  if (Array.isArray(listeners)) {
    return listeners.map(
      (e) => {
        if (!Array.isArray(e)) {
          return [event, data => dispatch(data)];
        }

        const [event, listener] = e;
        return [event, data => listener(data, dispatch, getState)];
      },
    );
  }

  return Object.keys(listeners)
    .map(event => [event, data => listeners[event](data, dispatch, getState, socket)]);
}

export function createEmiters({ dispatch, getState, socket }, action, emitters = {}) {
  invariant(
    ['[object Object]', '[object Array]'].includes(Object.prototype.toString.call(emitters)),
    'createListeners: listeners should be an object or an array!',
  );

  if (Array.isArray(emitters)) {
    return emitters.map(([event, evaluate, data = ac => ac, callback]) => [
      event,
      () => evaluate(action, dispatch, getState, socket),
      () => (typeof data === 'function' ? data(action) : data),
      (data) => callback && callback(data, action, dispatch, getState, socket)
    ]);
  }

  return Object.keys(emitters).map((event) => {
    const { evaluate, data = ac => ac } = emitters[event];
    return [
      event,
      () => evaluate(action, dispatch, getState, socket),
      () => (typeof data === 'function' ? data(action) : data),
    ];
  });
}

export function createAsyncs({ dispatch, getState, socket }, action, asyncs = []) {
  invariant(
    Array.isArray(asyncs),
    'createAsyncs: asyncs should be an array!',
  );

  return asyncs.map(({ evaluate = () => false, request = () => {} }) => [
    () => evaluate(action, dispatch, getState, socket),
    () => request(action, dispatch, getState, socket),
  ]);
}
