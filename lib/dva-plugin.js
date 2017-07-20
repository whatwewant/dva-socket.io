'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createDvaSocket;

var _middleware = require('./middleware');

var _middleware2 = _interopRequireDefault(_middleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createDvaSocket(url, options, rules) {
  var middleware = (0, _middleware2.default)(url, options, rules);

  return {
    onAction: [middleware]
  };
}