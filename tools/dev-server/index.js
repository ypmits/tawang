const express = require('express');
const app = express();
const fs = require('fs');
const sourceMap = require('source-map');
const https = require('https');

// Options for SSl
var options = {
  key: fs.readFileSync('./cert/ssl.key'),
  cert: fs.readFileSync('./cert/ssl.crt'),
  requestCert: false,
  rejectUnauthorized: false,
};

// Creating a https webserver
var server = https.createServer(options, app).listen(443, function() {
  console.log('server started at port 443');
});

// Midlleware for parsing the POST body onto an object
app.use(express.json());

// Post endpoint accepts a sourcemap, a line number and a column
// number. It then parses the sourcemap and transforms the submitted
// line and column number into the original line number.
// The location in the original code is then comitted back.
app.post('/api/parse-sourcemap', function(req, res) {
  let map = JSON.parse(req.body.map);

  sourceMap.SourceMapConsumer.with(map, null, consumer => {
    // Making the endpoint for error parsing
    // Getting the line and cloumn number from the request's GET parameters

    // Getting the line and column number from POST body.
    let line = parseInt(req.body.error.line);
    let column = parseInt(req.body.error.line);

    // Getting the original line and column number
    let originalError = consumer.originalPositionFor({
      line: line,
      column: column,
    });

    res.json(originalError);
  });
});

// Loading in source map
const rawSourceMap = JSON.parse(fs.readFileSync('./build/main.bundle.js.map', 'utf8'));

// TODO: Handle when the consumer isn't ready yet, but there is already a request coming in.

sourceMap.SourceMapConsumer.with(rawSourceMap, null, consumer => {
  // Making the endpoint for error parsing
  app.get('/api/error', function(req, res) {
    // Getting the line and cloumn number from the request's GET parameters

    let line = parseInt(req.query.line);
    let column = parseInt(req.query.column);

    console.log({
      line,
      column,
    });

    // Getting the original line and column number
    let originalError = consumer.originalPositionFor({
      line: line,
      column: column,
    });
    console.error(originalError);
    res.json(originalError);
  });
});
