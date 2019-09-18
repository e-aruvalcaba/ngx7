/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(function(req, res, next) {
  var auth;

  // check whether an autorization header was send    
  if (req.headers.authorization) {
    // only accepting basic auth, so:
    // * cut the starting "Basic " from the header
    // * decode the base64 encoded username:password
    // * split the string at the colon
    // -> should result in an array
    auth = new Buffer(req.headers.authorization.substring(6), 'base64').toString().split(':');
  }

  // checks if:
  // * auth array exists 
  // * first value matches the expected user 
  // * second value the expected password
  if (!auth || auth[0] !== 'cemex' || auth[1] !== 'design2018') {
      // any of the tests failed
      // send an Basic Auth request (HTTP Code: 401 Unauthorized)
      res.statusCode = 401;
      // MyRealmName can be changed to anything, will be prompted to the user
      res.setHeader('WWW-Authenticate', 'Basic realm="MyRealmName"');
      // this will displayed in the browser when authorization is cancelled
      res.end('Unauthorized');
  } else {
      // continue with processing, user was authenticated
      next();
  }
});
app.use(express.static(__dirname + '/dist'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
