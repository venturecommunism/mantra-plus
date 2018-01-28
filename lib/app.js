'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _reactSimpleDi = require('react-simple-di');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = function () {
  function App(context) {
    (0, _classCallCheck3.default)(this, App);

    if (!context) {
      var message = 'Context is required when creating a new app.';
      throw new Error(message);
    }

    this.context = context;
    this.actions = {};
    this._routeFns = [];
    this._moduleWillLoad = [];
    this._moduleWillInit = [];
  }

  (0, _createClass3.default)(App, [{
    key: '_bindContext',
    value: function _bindContext(_actions) {
      var actions = {};
      for (var key in _actions) {
        if (_actions.hasOwnProperty(key)) {
          var actionMap = _actions[key];
          var newActionMap = {};
          for (var actionName in actionMap) {
            if (actionMap.hasOwnProperty(actionName)) {
              newActionMap[actionName] = actionMap[actionName].bind(null, this.context);
            }
          }
          actions[key] = newActionMap;
        }
      }

      return actions;
    }
  }, {
    key: 'loadMiddlewares',
    value: function loadMiddlewares(middlewares) {
      var _this = this;

      this._checkForInit();

      if (!middlewares) {
        var message = 'Should provide at least one middleware';
        throw new Error(message);
      }

      if (!middlewares instanceof Array) {
        var _message = 'Middlewares must be in an array';
        throw new Error(_message);
      }

      middlewares.forEach(function (middleware) {
        if (!middleware instanceof Object) {
          var _message2 = 'Middlewares must be an object';
          throw new Error(_message2);
        }

        if (middleware.moduleWillLoad) {
          if (typeof middleware.moduleWillLoad !== 'function') {
            var _message3 = 'moduleWillLoad should be a function';
            throw new Error(_message3);
          }

          _this._moduleWillLoad.push(middleware.moduleWillLoad);
        }

        if (middleware.moduleWillInit) {
          if (typeof middleware.moduleWillInit !== 'function') {
            var _message4 = 'moduleWillLoad should be a function';
            throw new Error(_message4);
          }

          _this._moduleWillInit.push(middleware.moduleWillInit);
        }
      });
    }
  }, {
    key: 'loadModule',
    value: function loadModule(module) {
      var _this2 = this;

      this._checkForInit();

      if (!module) {
        var message = 'Should provide at least one module to load.';
        throw new Error(message);
      }

      if (module.__loaded) {
        var _message5 = 'This module is already loaded.';
        throw new Error(_message5);
      }

      // load routes
      if (module.routes) {
        if (typeof module.routes !== 'function') {
          var _message6 = "Module's routes field should be a function.";
          throw new Error(_message6);
        }

        this._routeFns.push(module.routes);
      }

      // load middlewares
      if (this._moduleWillLoad.length > 0) {
        var middlewares = this._moduleWillLoad;
        middlewares.forEach(function (middleware) {
          // module.actions doesn't have context binded.
          // to use actions, context needs to be passed in
          // manually like this:
          // module.action.todo.someAction(context, actionArgs);
          middleware.call(_this2, module, _this2.context);
        });
      }

      // load actions
      var actions = module.actions || {};
      this.actions = (0, _extends3.default)({}, this.actions, actions);

      // load other stuffs
      if (module.load) {
        if (typeof module.load !== 'function') {
          var _message7 = 'module.load should be a function';
          throw new Error(_message7);
        }

        // This module has no access to the actions loaded after this module.
        var boundedActions = this._bindContext(this.actions);
        module.load(this.context, boundedActions);
      }

      module.__loaded = true;
    }
  }, {
    key: 'init',
    value: function init() {
      var _this3 = this;

      this._checkForInit();

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(this._routeFns), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var routeFn = _step.value;

          var inject = function inject(comp) {
            return (0, _reactSimpleDi.injectDeps)(_this3.context, _this3.actions)(comp);
          };

          routeFn(inject, this.context, this.actions);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (this._moduleWillInit.length > 0) {
        var middlewares = this._moduleWillInit;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = (0, _getIterator3.default)(middlewares), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var middleware = _step2.value;

            middleware.call(this);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }

      this._routeFns = [];
      this._modulesWillLoad = [];
      this._moduleWillInit = [];
      this.__initialized = true;
    }
  }, {
    key: '_checkForInit',
    value: function _checkForInit() {
      if (this.__initialized) {
        var message = 'App is already initialized';
        throw new Error(message);
      }
    }
  }]);
  return App;
}();

exports.default = App;