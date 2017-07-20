/**
* @Author: eason
* @Date:   2017-07-20T14:16:57+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2017-07-20T14:23:48+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/
import invariant from 'invariant';
import io from 'socket.io-client';

export default function createMiddleware(url, options, rules) {
  const socket = io(url, options);

  return ({ dispatch }) => {
    const listeners = createListeners(dispatch, rules.on);
    listeners.forEach(([event, listener]) => socket.on(event, listener));

    return next => (action) => {
      const emitters = createEmiters(dispatch, action, rules.emit);

      emitters.forEach(([event, evaluate, data]) => {
        if (evaluate()) {
          socket.emit(event, data());
        }
      });

      return next(action);
    };
  };
}

export function createListeners(dispatch, listeners = {}) {
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
        return [event, data => listener(data, dispatch)];
      },
    );
  }

  return Object.keys(listeners)
    .map(event => [event, data => listeners[event](data, dispatch)]);
}

export function createEmiters(dispatch, action, emitters = {}) {
  invariant(
    ['[object Object]', '[object Array]'].includes(Object.prototype.toString.call(emitters)),
    'createListeners: listeners should be an object or an array!',
  );

  if (Array.isArray(emitters)) {
    return emitters.map(([event, evaluate, data = ac => ac]) => [
      event,
      () => evaluate(action, dispatch),
      () => (typeof data === 'function' ? data(action) : data),
    ]);
  }

  return Object.keys(emitters).map((event) => {
    const { evaluate, data = ac => ac } = emitters[event];
    return [
      event,
      () => evaluate(action, dispatch),
      () => (typeof data === 'function' ? data(action) : data),
    ];
  });
}
