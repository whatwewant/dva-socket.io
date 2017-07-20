'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

exports.default = createMiddleware;
exports.createListeners = createListeners;
exports.createEmiters = createEmiters;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createMiddleware(url, options, rules) {
  var socket = (0, _socket2.default)(url, options);

  return function (_ref) {
    var dispatch = _ref.dispatch;

    var listeners = createListeners(dispatch, rules.on);
    listeners.forEach(function (_ref2) {
      var _ref3 = (0, _slicedToArray3.default)(_ref2, 2),
          event = _ref3[0],
          listener = _ref3[1];

      return socket.on(event, listener);
    });

    return function (next) {
      return function (action) {
        var emitters = createEmiters(dispatch, action, rules.emit);

        emitters.forEach(function (_ref4) {
          var _ref5 = (0, _slicedToArray3.default)(_ref4, 3),
              event = _ref5[0],
              evaluate = _ref5[1],
              data = _ref5[2];

          if (evaluate()) {
            socket.emit(event, data());
          }
        });

        return next(action);
      };
    };
  };
}

function createListeners(dispatch) {
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
        return listener(data, dispatch);
      }];
    });
  }

  return (0, _keys2.default)(listeners).map(function (event) {
    return [event, function (data) {
      return listeners[event](data, dispatch);
    }];
  });
}

function createEmiters(dispatch, action) {
  var emitters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  (0, _invariant2.default)(['[object Object]', '[object Array]'].includes(Object.prototype.toString.call(emitters)), 'createListeners: listeners should be an object or an array!');

  if (Array.isArray(emitters)) {
    return emitters.map(function (_ref6) {
      var _ref7 = (0, _slicedToArray3.default)(_ref6, 3),
          event = _ref7[0],
          evaluate = _ref7[1],
          _ref7$ = _ref7[2],
          data = _ref7$ === undefined ? function (ac) {
        return ac;
      } : _ref7$;

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
      return evaluate(action, dispatch);
    }, function () {
      return typeof data === 'function' ? data(action) : data;
    }];
  });
}