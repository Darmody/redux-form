'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mapValues2 = require('lodash/mapValues');

var _mapValues3 = _interopRequireDefault(_mapValues2);

var _partial2 = require('lodash/partial');

var _partial3 = _interopRequireDefault(_partial2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _reactRedux = require('react-redux');

var _createFieldArrayProps = require('./createFieldArrayProps');

var _createFieldArrayProps2 = _interopRequireDefault(_createFieldArrayProps);

var _plain = require('./structure/plain');

var _plain2 = _interopRequireDefault(_plain);

var _reactAddonsShallowCompare = require('react-addons-shallow-compare');

var _reactAddonsShallowCompare2 = _interopRequireDefault(_reactAddonsShallowCompare);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var createConnectedFieldArray = function createConnectedFieldArray(_ref, _ref2, name) {
  var arrayInsert = _ref.arrayInsert;
  var arrayPop = _ref.arrayPop;
  var arrayPush = _ref.arrayPush;
  var arrayRemove = _ref.arrayRemove;
  var arrayShift = _ref.arrayShift;
  var arraySplice = _ref.arraySplice;
  var arraySwap = _ref.arraySwap;
  var arrayUnshift = _ref.arrayUnshift;
  var asyncValidate = _ref.asyncValidate;
  var blur = _ref.blur;
  var change = _ref.change;
  var focus = _ref.focus;
  var getFormState = _ref.getFormState;
  var initialValues = _ref.initialValues;
  var deepEqual = _ref2.deepEqual;
  var getIn = _ref2.getIn;
  var size = _ref2.size;


  var propInitialValue = initialValues && getIn(initialValues, name);

  var ConnectedFieldArray = function (_Component) {
    _inherits(ConnectedFieldArray, _Component);

    function ConnectedFieldArray() {
      _classCallCheck(this, ConnectedFieldArray);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(ConnectedFieldArray).apply(this, arguments));
    }

    _createClass(ConnectedFieldArray, [{
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps, nextState) {
        return (0, _reactAddonsShallowCompare2.default)(this, nextProps, nextState);
      }
    }, {
      key: 'getRenderedComponent',
      value: function getRenderedComponent() {
        return this.refs.renderedComponent;
      }
    }, {
      key: 'render',
      value: function render() {
        var _props = this.props;
        var component = _props.component;
        var withRef = _props.withRef;

        var rest = _objectWithoutProperties(_props, ['component', 'withRef']);

        var props = (0, _createFieldArrayProps2.default)(getIn, size, name, rest, this.syncError);
        if (withRef) {
          props.ref = 'renderedComponent';
        }
        return (0, _react.createElement)(component, props);
      }
    }, {
      key: 'syncError',
      get: function get() {
        var getSyncErrors = this.context._reduxForm.getSyncErrors;

        return _plain2.default.getIn(getSyncErrors(), name + '._error');
      }
    }, {
      key: 'dirty',
      get: function get() {
        return this.props.dirty;
      }
    }, {
      key: 'pristine',
      get: function get() {
        return this.props.pristine;
      }
    }, {
      key: 'value',
      get: function get() {
        return this.props.value;
      }
    }]);

    return ConnectedFieldArray;
  }(_react.Component);

  ConnectedFieldArray.propTypes = {
    component: _react.PropTypes.oneOfType([_react.PropTypes.func, _react.PropTypes.string]).isRequired,
    defaultValue: _react.PropTypes.any,
    props: _react.PropTypes.object
  };

  ConnectedFieldArray.contextTypes = {
    _reduxForm: _react.PropTypes.object
  };

  var actions = (0, _mapValues3.default)({
    arrayInsert: arrayInsert,
    arrayPop: arrayPop,
    arrayPush: arrayPush,
    arrayRemove: arrayRemove,
    arrayShift: arrayShift,
    arraySplice: arraySplice,
    arraySwap: arraySwap,
    arrayUnshift: arrayUnshift
  }, function (actionCreator) {
    return (0, _partial3.default)(actionCreator, name);
  });
  var connector = (0, _reactRedux.connect)(function (state) {
    var initial = getIn(getFormState(state), 'initial.' + name) || propInitialValue;
    var value = getIn(getFormState(state), 'values.' + name);
    var pristine = deepEqual(value, initial);
    return {
      asyncError: getIn(getFormState(state), 'asyncErrors.' + name + '._error'),
      dirty: !pristine,
      pristine: pristine,
      submitError: getIn(getFormState(state), 'submitErrors.' + name + '._error'),
      value: value
    };
  }, actions, undefined, { withRef: true });
  return connector(ConnectedFieldArray);
};

exports.default = createConnectedFieldArray;