/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const
conf = require('../configuration.js'),
keys = require('../keys.js'),
wsapi = require('../wsapi.js');

exports.url = '/key';
exports.method = 'post';
exports.writes_db = true;

exports.process = function(req, res) {
  if (req.body.userkey) {
    keys.set_user_key(req.body.assertion, req.body.userkey, function () {
      res.json({error: null});
    }, function (err) {
      res.json({error: err });
    });
  } else {
    keys.get_user_key(req.body.assertion, function (userKey) {
      res.json({userkey: userKey});
    }, function (err) {
      res.json({error: err });
    });
  }
};
