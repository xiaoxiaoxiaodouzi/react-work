'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CURRENT = undefined;

var _Authorized = require('./Authorized');

var _Authorized2 = _interopRequireDefault(_Authorized);

var _AuthorizedRoute = require('./AuthorizedRoute');

var _AuthorizedRoute2 = _interopRequireDefault(_AuthorizedRoute);

var _Secured = require('./Secured');

var _Secured2 = _interopRequireDefault(_Secured);

var _CheckPermissions = require('./CheckPermissions.js');

var _CheckPermissions2 = _interopRequireDefault(_CheckPermissions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable import/no-mutable-exports */
var CURRENT = 'NULL';

_Authorized2.default.Secured = _Secured2.default;
_Authorized2.default.AuthorizedRoute = _AuthorizedRoute2.default;
_Authorized2.default.check = _CheckPermissions2.default;

/**
 * use  authority or getAuthority
 * @param {string|()=>String} currentAuthority
 */
var renderAuthorize = function renderAuthorize(currentAuthority) {
  if (currentAuthority) {
    if (currentAuthority.constructor.name === 'Function') {
      exports.CURRENT = CURRENT = currentAuthority();
    }
    if (currentAuthority.constructor.name === 'String') {
      exports.CURRENT = CURRENT = currentAuthority;
    }
  } else {
    exports.CURRENT = CURRENT = 'NULL';
  }
  return _Authorized2.default;
};

exports.CURRENT = CURRENT;
exports.default = renderAuthorize;