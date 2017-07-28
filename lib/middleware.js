'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

exports.createMiddleware = createMiddleware;
exports.createListeners = createListeners;
exports.createEmiters = createEmiters;
exports.createAsyncs = createAsyncs;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createMiddleware(url, options, rules) {
  var socket = (0, _socket2.default)(url, options);

  return function (_ref) {
    var dispatch = _ref.dispatch,
        getState = _ref.getState;

    var listeners = createListeners({ dispatch: dispatch, getState: getState }, rules.on);
    listeners.forEach(function (_ref2) {
      var _ref3 = (0, _slicedToArray3.default)(_ref2, 2),
          event = _ref3[0],
          listener = _ref3[1];

      return socket.on(event, listener);
    });

    return function (next) {
      return function (action) {
        var emitters = createEmiters({ dispatch: dispatch, getState: getState }, action, rules.emit);
        var asyncs = createAsyncs({ dispatch: dispatch, getState: getState }, action, rules.asyncs);

        emitters.forEach(function (_ref4) {
          var _ref5 = (0, _slicedToArray3.default)(_ref4, 3),
              event = _ref5[0],
              evaluate = _ref5[1],
              data = _ref5[2];

          if (evaluate()) {
            socket.emit(event, data());
          }
        });

        asyncs.forEach(function (_ref6) {
          var _ref7 = (0, _slicedToArray3.default)(_ref6, 2),
              evaluate = _ref7[0],
              request = _ref7[1];

          if (evaluate()) {
            request();
          }
        });

        return next(action);
      };
    };
  };
}

function createListeners(_ref8) {
  var dispatch = _ref8.dispatch,
      getState = _ref8.getState;
  var listeners = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  (0, _invariant2.default)(['[object Object]', '[object Array]'].includes(Object.prototype.toString.call(listeners)), 'createListeners: listeners should be an object or an array!');

  if (Array.isArray(listeners)) {
    return listeners.map(function (e) {
      if (!Array.isArray(e)) {
        return [event, function (data) {
          return dispatch(data);
        }];
      }

      var _e = (0, _slicedToArray3.default)(e, 2),
          event = _e[0],
          listener = _e[1];

      return [event, function (data) {
        return listener(data, dispatch, getState);
      }];
    });
  }

  return (0, _keys2.default)(listeners).map(function (event) {
    return [event, function (data) {
      return listeners[event](data, dispatch, getState);
    }];
  });
}

function createEmiters(_ref9, action) {
  var dispatch = _ref9.dispatch,
      getState = _ref9.getState;
  var emitters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  (0, _invariant2.default)(['[object Object]', '[object Array]'].includes(Object.prototype.toString.call(emitters)), 'createListeners: listeners should be an object or an array!');

  if (Array.isArray(emitters)) {
    return emitters.map(function (_ref10) {
      var _ref11 = (0, _slicedToArray3.default)(_ref10, 3),
          event = _ref11[0],
          evaluate = _ref11[1],
          _ref11$ = _ref11[2],
          data = _ref11$ === undefined ? function (ac) {
        return ac;
      } : _ref11$;

      return [event, function () {
        return evaluate(action, dispatch);
      }, function () {
        return typeof data === 'function' ? data(action) : data;
      }];
    });
  }

  return (0, _keys2.default)(emitters).map(function (event) {
    var _emitters$event = emitters[event],
        evaluate = _emitters$event.evaluate,
        _emitters$event$data = _emitters$event.data,
        data = _emitters$event$data === undefined ? function (ac) {
      return ac;
    } : _emitters$event$data;

    return [event, function () {
      return evaluate(action, dispatch, getState);
    }, function () {
      return typeof data === 'function' ? data(action) : data;
    }];
  });
}

function createAsyncs(_ref12, action) {
  var dispatch = _ref12.dispatch,
      getState = _ref12.getState;
  var asyncs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  (0, _invariant2.default)(Array.isArray(asyncs), 'createAsyncs: asyncs should be an array!');

  return asyncs.map(function (_ref13) {
    var _ref13$evaluate = _ref13.evaluate,
        evaluate = _ref13$evaluate === undefined ? function () {
      return false;
    } : _ref13$evaluate,
        _ref13$request = _ref13.request,
        request = _ref13$request === undefined ? function () {} : _ref13$request;
    return [function () {
      return evaluate(action, dispatch, getState);
    }, function () {
      return request(action, dispatch, getState);
    }];
  });
}