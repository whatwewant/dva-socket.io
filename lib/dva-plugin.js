'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createDvaSocket;

var _middleware = require('./middleware');

function createDvaSocket(url, options, rules, ref_io) {
  var middleware = (0, _middleware.createMiddleware)(url, options, rules, ref_io);

  return {
    onAction: [middleware]
  };
}