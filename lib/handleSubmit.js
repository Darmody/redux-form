'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isPromise = require('is-promise');

var _isPromise2 = _interopRequireDefault(_isPromise);

var _SubmissionError = require('./SubmissionError');

var _SubmissionError2 = _interopRequireDefault(_SubmissionError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var handleSubmit = function handleSubmit(submit, props, valid, asyncValidate, fields) {
  var dispatch = props.dispatch;
  var startSubmit = props.startSubmit;
  var stopSubmit = props.stopSubmit;
  var setSubmitFailed = props.setSubmitFailed;
  var syncErrors = props.syncErrors;
  var returnRejectedSubmitPromise = props.returnRejectedSubmitPromise;
  var touch = props.touch;
  var values = props.values;


  touch.apply(undefined, _toConsumableArray(fields)); // mark all fields as touched

  if (valid) {
    var doSubmit = function doSubmit() {
      var result = submit(values, dispatch);
      if ((0, _isPromise2.default)(result)) {
        startSubmit();
        return result.then(function (submitResult) {
          stopSubmit();
          return submitResult;
        }).catch(function (submitError) {
          stopSubmit(submitError instanceof _SubmissionError2.default ? submitError.errors : undefined);
          if (returnRejectedSubmitPromise) {
            return Promise.reject(submitError);
          }
        });
      }
      return result;
    };

    var asyncValidateResult = asyncValidate && asyncValidate();
    if (asyncValidateResult) {
      return asyncValidateResult.then(doSubmit, function (asyncErrors) {
        setSubmitFailed.apply(undefined, _toConsumableArray(fields));
        if (returnRejectedSubmitPromise) {
          return Promise.reject(asyncErrors);
        }
      });
    } else {
      return doSubmit();
    }
  } else {
    setSubmitFailed.apply(undefined, _toConsumableArray(fields));

    if (returnRejectedSubmitPromise) {
      return Promise.reject(syncErrors);
    }
  }
};

exports.default = handleSubmit;