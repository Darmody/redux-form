'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _expect = require('expect');

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _reduxImmutablejs = require('redux-immutablejs');

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _reduxForm = require('../reduxForm');

var _reduxForm2 = _interopRequireDefault(_reduxForm);

var _reducer = require('../reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _Field = require('../Field');

var _Field2 = _interopRequireDefault(_Field);

var _plain = require('../structure/plain');

var _plain2 = _interopRequireDefault(_plain);

var _expectations = require('../structure/plain/expectations');

var _expectations2 = _interopRequireDefault(_expectations);

var _immutable = require('../structure/immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _expectations3 = require('../structure/immutable/expectations');

var _expectations4 = _interopRequireDefault(_expectations3);

var _addExpectations = require('./addExpectations');

var _addExpectations2 = _interopRequireDefault(_addExpectations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint react/no-multi-comp:0 */


var describeField = function describeField(name, structure, combineReducers, expect) {
  var reduxForm = (0, _reduxForm2.default)(structure);
  var Field = (0, _Field2.default)(structure);
  var reducer = (0, _reducer2.default)(structure);
  var fromJS = structure.fromJS;

  var makeStore = function makeStore(initial) {
    return (0, _redux.createStore)(combineReducers({ form: reducer }), fromJS({ form: initial }));
  };

  var TestInput = function (_Component) {
    _inherits(TestInput, _Component);

    function TestInput() {
      _classCallCheck(this, TestInput);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(TestInput).apply(this, arguments));
    }

    _createClass(TestInput, [{
      key: 'render',
      value: function render() {
        return _react2.default.createElement(
          'div',
          null,
          'TEST INPUT'
        );
      }
    }]);

    return TestInput;
  }(_react.Component);

  var testProps = function testProps(state) {
    var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var store = makeStore({ testForm: state });

    var Form = function (_Component2) {
      _inherits(Form, _Component2);

      function Form() {
        _classCallCheck(this, Form);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Form).apply(this, arguments));
      }

      _createClass(Form, [{
        key: 'render',
        value: function render() {
          return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(Field, { name: 'foo', component: TestInput })
          );
        }
      }]);

      return Form;
    }(_react.Component);

    var TestForm = reduxForm(_extends({ form: 'testForm' }, config))(Form);
    var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      _reactRedux.Provider,
      { store: store },
      _react2.default.createElement(TestForm, null)
    ));
    return _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, TestInput).props;
  };

  describe(name, function () {
    it('should throw an error if not in ReduxForm', function () {
      expect(function () {
        _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(Field, { name: 'foo', component: TestInput })
        ));
      }).toThrow(/must be inside a component decorated with reduxForm/);
    });

    it('should get value from Redux state', function () {
      var props = testProps({
        values: {
          foo: 'bar'
        }
      });
      expect(props.value).toBe('bar');
    });

    it('should get dirty/pristine from Redux state', function () {
      var props1 = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'bar'
        }
      });
      expect(props1.pristine).toBe(true);
      expect(props1.dirty).toBe(false);
      var props2 = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'baz'
        }
      });
      expect(props2.pristine).toBe(false);
      expect(props2.dirty).toBe(true);
    });

    it('should get asyncValidating from Redux state', function () {
      var props1 = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'bar'
        },
        asyncValidating: 'dog'
      });
      expect(props1.asyncValidating).toBe(false);
      var props2 = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'baz'
        },
        asyncValidating: 'foo'
      });
      expect(props2.asyncValidating).toBe(true);
    });

    it('should get sync errors from outer reduxForm component', function () {
      var props = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'bar'
        }
      }, {
        validate: function validate() {
          return { foo: 'foo error' };
        }
      });
      expect(props.error).toBe('foo error');
    });

    it('should get async errors from Redux state', function () {
      var props = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'bar'
        },
        asyncErrors: {
          foo: 'foo error'
        }
      });
      expect(props.error).toBe('foo error');
    });

    it('should get submit errors from Redux state', function () {
      var props = testProps({
        initial: {
          foo: 'bar'
        },
        values: {
          foo: 'bar'
        },
        submitErrors: {
          foo: 'foo error'
        }
      });
      expect(props.error).toBe('foo error');
    });

    it('should provide name getter', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: 'bar'
          }
        }
      });

      var Form = function (_Component3) {
        _inherits(Form, _Component3);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, Object.getPrototypeOf(Form).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(Field, { name: 'foo', component: TestInput })
            );
          }
        }]);

        return Form;
      }(_react.Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(TestForm, null)
      ));
      var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Field);
      expect(stub.name).toBe('foo');
    });

    it('should provide value getter', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: 'bar'
          }
        }
      });

      var Form = function (_Component4) {
        _inherits(Form, _Component4);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, Object.getPrototypeOf(Form).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(Field, { name: 'foo', component: TestInput })
            );
          }
        }]);

        return Form;
      }(_react.Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(TestForm, null)
      ));
      var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Field);
      expect(stub.value).toBe('bar');
    });

    it('should provide dirty getter that is true when dirty', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: 'bar'
          }
        }
      });

      var Form = function (_Component5) {
        _inherits(Form, _Component5);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, Object.getPrototypeOf(Form).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(Field, { name: 'foo', component: TestInput })
            );
          }
        }]);

        return Form;
      }(_react.Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(TestForm, null)
      ));
      var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Field);
      expect(stub.dirty).toBe(true);
    });

    it('should provide dirty getter that is false when pristine', function () {
      var store = makeStore({
        testForm: {
          initial: {
            foo: 'bar'
          },
          values: {
            foo: 'bar'
          }
        }
      });

      var Form = function (_Component6) {
        _inherits(Form, _Component6);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, Object.getPrototypeOf(Form).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(Field, { name: 'foo', component: TestInput })
            );
          }
        }]);

        return Form;
      }(_react.Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(TestForm, null)
      ));
      var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Field);
      expect(stub.dirty).toBe(false);
    });

    it('should provide pristine getter that is false when dirty', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: 'bar'
          }
        }
      });

      var Form = function (_Component7) {
        _inherits(Form, _Component7);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, Object.getPrototypeOf(Form).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(Field, { name: 'foo', component: TestInput })
            );
          }
        }]);

        return Form;
      }(_react.Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(TestForm, null)
      ));
      var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Field);
      expect(stub.pristine).toBe(false);
    });

    it('should provide pristine getter that is true when pristine', function () {
      var store = makeStore({
        testForm: {
          initial: {
            foo: 'bar'
          },
          values: {
            foo: 'bar'
          }
        }
      });

      var Form = function (_Component8) {
        _inherits(Form, _Component8);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, Object.getPrototypeOf(Form).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(Field, { name: 'foo', component: TestInput })
            );
          }
        }]);

        return Form;
      }(_react.Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(TestForm, null)
      ));
      var stub = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Field);
      expect(stub.pristine).toBe(true);
    });

    it('should have value set to initial value on first render', function () {
      var store = makeStore({});
      var input = (0, _expect.createSpy)(function (props) {
        return _react2.default.createElement('input', props);
      }).andCallThrough();

      var Form = function (_Component9) {
        _inherits(Form, _Component9);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, Object.getPrototypeOf(Form).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(Field, { name: 'foo', component: input })
            );
          }
        }]);

        return Form;
      }(_react.Component);

      var TestForm = reduxForm({
        form: 'testForm'
      })(Form);
      _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(TestForm, { initialValues: { foo: 'bar' } })
      ));
      expect(input).toHaveBeenCalled();
      expect(input.calls[0].arguments[0].value).toBe('bar');
    });

    it('should provide sync error for array field', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: ['bar']
          }
        }
      });
      var input = (0, _expect.createSpy)(function (props) {
        return _react2.default.createElement('input', props);
      }).andCallThrough();
      var validate = function validate() {
        return { foo: ['bar error'] };
      };

      var Form = function (_Component10) {
        _inherits(Form, _Component10);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, Object.getPrototypeOf(Form).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(Field, { name: 'foo[0]', component: input })
            );
          }
        }]);

        return Form;
      }(_react.Component);

      var TestForm = reduxForm({
        form: 'testForm',
        validate: validate
      })(Form);
      _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(TestForm, null)
      ));
      expect(input).toHaveBeenCalled();
      expect(input.calls[0].arguments[0].valid).toBe(false);
      expect(input.calls[0].arguments[0].error).toBe('bar error');
    });

    it('should provide access to rendered component', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: 'bar'
          }
        }
      });

      var Form = function (_Component11) {
        _inherits(Form, _Component11);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, Object.getPrototypeOf(Form).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(Field, { name: 'foo', component: TestInput, withRef: true })
            );
          }
        }]);

        return Form;
      }(_react.Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(TestForm, null)
      ));
      var field = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, Field);
      var input = _reactAddonsTestUtils2.default.findRenderedComponentWithType(dom, TestInput);

      expect(field.getRenderedComponent()).toBe(input);
    });

    it('should reconnect when name changes', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: 'fooValue',
            bar: 'barValue'
          },
          fields: {
            bar: {
              touched: true
            }
          }
        }
      });
      var input = (0, _expect.createSpy)(function (props) {
        return _react2.default.createElement('input', props);
      }).andCallThrough();

      var Form = function (_Component12) {
        _inherits(Form, _Component12);

        function Form() {
          _classCallCheck(this, Form);

          var _this12 = _possibleConstructorReturn(this, Object.getPrototypeOf(Form).call(this));

          _this12.state = { field: 'foo' };
          return _this12;
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            var _this13 = this;

            return _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(Field, { name: this.state.field, component: input }),
              _react2.default.createElement(
                'button',
                { onClick: function onClick() {
                    return _this13.setState({ field: 'bar' });
                  } },
                'Change'
              )
            );
          }
        }]);

        return Form;
      }(_react.Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(TestForm, null)
      ));
      expect(input).toHaveBeenCalled();
      expect(input.calls.length).toBe(1);
      expect(input.calls[0].arguments[0].value).toBe('fooValue');
      expect(input.calls[0].arguments[0].touched).toBe(false);

      var button = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(dom, 'button');
      _reactAddonsTestUtils2.default.Simulate.click(button);

      expect(input.calls.length).toBe(2);
      expect(input.calls[1].arguments[0].value).toBe('barValue');
      expect(input.calls[1].arguments[0].touched).toBe(true);
    });

    it('should rerender when props change', function () {
      var store = makeStore();
      var input = (0, _expect.createSpy)(function (props) {
        return _react2.default.createElement('input', props);
      }).andCallThrough();

      var Form = function (_Component13) {
        _inherits(Form, _Component13);

        function Form() {
          _classCallCheck(this, Form);

          var _this14 = _possibleConstructorReturn(this, Object.getPrototypeOf(Form).call(this));

          _this14.state = { foo: 'foo', bar: 'bar' };
          return _this14;
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            var _this15 = this;

            return _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement(Field, { name: 'foo', foo: this.state.foo, bar: this.state.bar, component: input }),
              _react2.default.createElement(
                'button',
                { onClick: function onClick() {
                    return _this15.setState({ foo: 'qux', bar: 'baz' });
                  } },
                'Change'
              )
            );
          }
        }]);

        return Form;
      }(_react.Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      var dom = _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(TestForm, null)
      ));
      expect(input).toHaveBeenCalled();
      expect(input.calls.length).toBe(1);
      expect(input.calls[0].arguments[0].foo).toBe('foo');
      expect(input.calls[0].arguments[0].bar).toBe('bar');

      var button = _reactAddonsTestUtils2.default.findRenderedDOMComponentWithTag(dom, 'button');
      _reactAddonsTestUtils2.default.Simulate.click(button);

      expect(input.calls.length).toBe(2);
      expect(input.calls[1].arguments[0].foo).toBe('qux');
      expect(input.calls[1].arguments[0].bar).toBe('baz');
    });

    // ----------------------------------------------
    // Uncomment this to confirm that #1024 is fixed.
    // ----------------------------------------------
    // it('should rerender when sync error changes', () => {
    //   const store = makeStore({
    //     testForm: {
    //       values: {
    //         password: 'redux-form sucks',
    //         confirm: 'redux-form rocks'
    //       }
    //     }
    //   })
    //   const passwordInput = createSpy(props => <input {...props}/>).andCallThrough()
    //   const confirmInput = createSpy(props => <input {...props}/>).andCallThrough()
    //   const validate = ({ password, confirm }) =>
    //     password === confirm ? {} : { confirm: 'Must match!' }
    //   class Form extends Component {
    //     render() {
    //       return (<div>
    //         <Field name="password" component={passwordInput}/>
    //         <Field name="confirm" component={confirmInput}/>
    //       </div>)
    //     }
    //   }
    //   const TestForm = reduxForm({
    //     form: 'testForm',
    //     validate
    //   })(Form)
    //   const dom = TestUtils.renderIntoDocument(
    //     <Provider store={store}>
    //       <TestForm/>
    //     </Provider>
    //   )
    //
    //   // password input rendered
    //   expect(passwordInput).toHaveBeenCalled()
    //   expect(passwordInput.calls.length).toBe(1)
    //
    //   // confirm input rendered with error
    //   expect(confirmInput).toHaveBeenCalled()
    //   expect(confirmInput.calls.length).toBe(1)
    //   expect(confirmInput.calls[ 0 ].arguments[ 0 ].valid).toBe(false)
    //   expect(confirmInput.calls[ 0 ].arguments[ 0 ].error).toBe('Must match!')
    //
    //   // update password field so that they match
    //   passwordInput.calls[ 0 ].arguments[ 0 ].onChange('redux-form rocks')
    //
    //   // password input rerendered
    //   expect(passwordInput.calls.length).toBe(2)
    //
    //   // confirm input should also rerender, but with no error
    //   expect(confirmInput.calls.length).toBe(2)
    //   expect(confirmInput.calls[ 1 ].arguments[ 0 ].valid).toBe(true)
    //   expect(confirmInput.calls[ 1 ].arguments[ 0 ].error).toBe(undefined)
    // })
  });
};

describeField('Field.plain', _plain2.default, _redux.combineReducers, (0, _addExpectations2.default)(_expectations2.default));
describeField('Field.immutable', _immutable2.default, _reduxImmutablejs.combineReducers, (0, _addExpectations2.default)(_expectations4.default));