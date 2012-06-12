/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

exports.get_user_key = function (assertion, successCB, failureCB) {
  // TODO: test with failureCB('not implemented');
  // TODO: verify the assertion
  setTimeout(function (){
    var userKey = JSON.stringify("TODO: secret"); // TODO: read from DB
    var b = new Buffer(userKey);
    successCB(b.toString('base64'));
  }, 0);
};
