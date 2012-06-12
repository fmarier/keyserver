/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const
http = require('http'),
https = require('https'),
qs = require('qs');

const
conf = require('./configuration.js');

const AUDIENCE = "http://" + conf.get('bind_to').host + ":" + conf.get('bind_to').port;

exports.get_user_key = function (assertion, successCB, failureCB) {
  function onVerifyResp(bidRes) {
    var data = "";
    bidRes.setEncoding('utf8');
    bidRes.on(
      'data', function (chunk) {
        data += chunk;
    });
    bidRes.on('end', function () {
      var verified = JSON.parse(data);
      if (verified.status === 'okay') {
        // TODO: read from DB (lookup key for verified.email)
        var userKey = JSON.stringify("TODO: secret");
        var b = new Buffer(userKey);
        successCB(b.toString('base64'));
      } else {
        failureCB("BrowserID verification error: " + verified.reason);
      }
    });
  };

  var body = qs.stringify({
    assertion: assertion,
    audience: AUDIENCE
  });
  var scheme = (conf.get('browserid').verifier.scheme === 'http') ? http : https;
  var request = scheme.request({
    host: conf.get('browserid').verifier.host,
    port: conf.get('browserid').verifier.port,
    path: '/verify',
    method: 'POST',
    headers: {'content-type': 'application/x-www-form-urlencoded',
      'content-length': body.length}
    }, onVerifyResp);
  request.write(body);
  request.end();
};
