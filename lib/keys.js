/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const
http = require('http'),
https = require('https'),
mysql = require('mysql'),
qs = require('qs');

const
conf = require('./configuration.js');

var client = mysql.createClient({
  user: conf.get('database').user,
  password: conf.get('database').password
});
client.query('USE ' + conf.get('database').name);

const AUDIENCE = conf.get('public_url');

function verify_assertion(assertion, successCB, failureCB) {
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
        successCB(verified.email);
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
}

function find_key(email, successCB, failureCB) {
  client.query("SELECT id, wrappedkey FROM userkey WHERE email = ?",
    [email], function (err, results, fields) {
      if (err) {
        failureCB(err);
      } else if (results.length === 1) {
        successCB(results[0].wrappedkey);
      } else if (results.length === 0) {
        successCB(null); // a key needs to be generated client-side
      } else {
        failureCB('Something is seriously wrong in the database');
      }
  });
}

function save_key(email, newKey, successCB, failureCB) {
  find_key(email, function (oldKey) {
    var sql;
    if (oldKey) {
      sql = "UPDATE userkey SET wrappedkey = ? WHERE email = ?";
    } else {
      sql = "INSERT INTO userkey(wrappedkey, email) VALUES (?, ?)";
    }

    client.query(sql, [newKey, email], function (err, results, fields) {
      if (err) {
        failureCB(err);
      } else {
        successCB();
      }
    });
  }, failureCB);
}

exports.set_user_key = function (assertion, userKey, successCB, failureCB) {
  verify_assertion(assertion, function (email) {
    save_key(email, userKey, successCB, failureCB);
  }, failureCB);
};

exports.get_user_key = function (assertion, successCB, failureCB) {
  verify_assertion(assertion, function (email) {
    find_key(email, function (userKey) {
      if (userKey) {
        var b = new Buffer(userKey);
        successCB(b.toString('base64'));
      } else {
        successCB(null);
      }
    }, failureCB);
  }, failureCB);
};
