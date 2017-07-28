'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAsyncs = exports.createEmiters = exports.createListeners = exports.createMiddleware = undefined;

var _middleware = require('./middleware');

Object.defineProperty(exports, 'createMiddleware', {
  enumerable: true,
  get: function get() {
    return _middleware.createMiddleware;
  }
});
Object.defineProperty(exports, 'createListeners', {
  enumerable: true,
  get: function get() {
    return _middleware.createListeners;
  }
});
Object.defineProperty(exports, 'createEmiters', {
  enumerable: true,
  get: function get() {
    return _middleware.createEmiters;
  }
});
Object.defineProperty(exports, 'createAsyncs', {
  enumerable: true,
  get: function get() {
    return _middleware.createAsyncs;
  }
});

var _dvaPlugin = require('./dva-plugin');

var _dvaPlugin2 = _interopRequireDefault(_dvaPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _dvaPlugin2.default;