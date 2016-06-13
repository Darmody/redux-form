'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mapValues2 = require('lodash/mapValues');

var _mapValues3 = _interopRequireDefault(_mapValues2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _reactRedux = require('react-redux');

var _createFieldProps = require('./createFieldProps');

var _createFieldProps2 = _interopRequireDefault(_createFieldProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var createConnectedField = function createConnectedField(_ref, _ref2, name) {
  var asyncValidate = _ref.asyncValidate;
  var blur = _ref.blur;
  var change = _ref.change;
  var focus = _ref.focus;
  var getFormState = _ref.getFormState;
  var initialValues = _ref.initialValues;
  var deepEqual = _ref2.deepEqual;
  var getIn = _ref2.getIn;


  var propInitialValue = initialValues && getIn(initialValues, name);

  var ConnectedField = function (_Component) {
    _inherits(ConnectedField, _Component);

    function ConnectedField() {
      _classCallCheck(this, ConnectedField);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(ConnectedField).apply(this, arguments));
    }

    _createClass(ConnectedField, [{
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps) {
        return !deepEqual(this.props, nextProps);
      }
    }, {
      key: 'isPristine',
      value: function isPristine() {
        return this.props.pristine;
      }
    }, {
      key: 'getValue',
      value: function getValue() {
        return this.props.value;
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

        var props = (0, _createFieldProps2.default)(getIn, name, rest, asyncValidate);
        if (withRef) {
          props.ref = 'renderedComponent';
        }
        return (0, _react.createElement)(component, props);
      }
    }]);

    return ConnectedField;
  }(_react.Component);

  ConnectedField.propTypes = {
    component: _react.PropTypes.oneOfType([_react.PropTypes.func, _react.PropTypes.string]).isRequired,
    defaultValue: _react.PropTypes.any,
    props: _react.PropTypes.object
  };

  ConnectedField.contextTypes = {
    _reduxForm: _react.PropTypes.object
  };

  var actions = (0, _mapValues3.default)({ blur: blur, change: change, focus: focus }, function (actionCreator) {
    return actionCreator.bind(null, name);
  });
  var connector = (0, _reactRedux.connect)(function (state, ownProps) {
    var initial = getIn(getFormState(state), 'initial.' + name) || propInitialValue;
    var value = getIn(getFormState(state), 'values.' + name);
    var pristine = value === initial;
    return {
      asyncError: getIn(getFormState(state), 'asyncErrors.' + name),
      asyncValidating: getIn(getFormState(state), 'asyncValidating') === name,
      dirty: !pristine,
      pristine: pristine,
      state: getIn(getFormState(state), 'fields.' + name),
      submitError: getIn(getFormState(state), 'submitErrors.' + name),
      value: value,
      _value: ownProps.value // save value passed in (for checkboxes)
    };
  }, actions, undefined, { withRef: true });
  return connector(ConnectedField);
};

exports.default = createConnectedField;