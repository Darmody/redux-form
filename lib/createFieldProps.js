'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _noop2 = require('lodash/noop');

var _noop3 = _interopRequireDefault(_noop2);

var _partial2 = require('lodash/partial');

var _partial3 = _interopRequireDefault(_partial2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createOnBlur = require('./events/createOnBlur');

var _createOnBlur2 = _interopRequireDefault(_createOnBlur);

var _createOnChange = require('./events/createOnChange');

var _createOnChange2 = _interopRequireDefault(_createOnChange);

var _createOnDragStart = require('./events/createOnDragStart');

var _createOnDragStart2 = _interopRequireDefault(_createOnDragStart);

var _createOnDrop = require('./events/createOnDrop');

var _createOnDrop2 = _interopRequireDefault(_createOnDrop);

var _createOnFocus = require('./events/createOnFocus');

var _createOnFocus2 = _interopRequireDefault(_createOnFocus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var processProps = function processProps(props, _value) {
  var type = props.type;
  var value = props.value;

  var rest = _objectWithoutProperties(props, ['type', 'value']);

  if (type === 'checkbox') {
    return _extends({}, rest, {
      checked: !!value,
      type: type
    });
  }
  if (type === 'radio') {
    return _extends({}, rest, {
      checked: value === _value,
      type: type,
      value: _value
    });
  }
  if (type === 'select-multiple') {
    return _extends({}, rest, {
      type: type,
      value: value || []
    });
  }
  return props;
};

var createFieldProps = function createFieldProps(getIn, name, _ref, syncError) {
  var asyncError = _ref.asyncError;
  var blur = _ref.blur;
  var change = _ref.change;
  var dirty = _ref.dirty;
  var focus = _ref.focus;
  var pristine = _ref.pristine;
  var state = _ref.state;
  var submitError = _ref.submitError;
  var value = _ref.value;
  var _value = _ref._value;
  var props = _ref.props;

  var rest = _objectWithoutProperties(_ref, ['asyncError', 'blur', 'change', 'dirty', 'focus', 'pristine', 'state', 'submitError', 'value', '_value', 'props']);

  var defaultValue = arguments.length <= 4 || arguments[4] === undefined ? '' : arguments[4];
  var asyncValidate = arguments.length <= 5 || arguments[5] === undefined ? _noop3.default : arguments[5];

  var error = syncError || asyncError || submitError;
  var onChange = (0, _createOnChange2.default)(change);
  return processProps(_extends({
    active: state && !!getIn(state, 'active'),
    dirty: dirty,
    error: error,
    invalid: !!error,
    name: name,
    onBlur: (0, _createOnBlur2.default)(blur, (0, _partial3.default)(asyncValidate, name)),
    onChange: onChange,
    onDragStart: (0, _createOnDragStart2.default)(name, value),
    onDrop: (0, _createOnDrop2.default)(name, change),
    onFocus: (0, _createOnFocus2.default)(name, focus),
    onUpdate: onChange,
    pristine: pristine,
    touched: !!(state && getIn(state, 'touched')),
    valid: !error,
    value: value == null ? defaultValue : value,
    visited: state && !!getIn(state, 'visited')
  }, props, rest), _value);
};

exports.default = createFieldProps;