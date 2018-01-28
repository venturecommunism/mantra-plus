'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useDeps = exports.createApp = undefined;

var _reactSimpleDi = require('react-simple-di');

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createApp = function createApp() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new (Function.prototype.bind.apply(_app2.default, [null].concat(args)))();
};

exports.createApp = createApp;
exports.useDeps = _reactSimpleDi.useDeps;