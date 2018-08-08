const needle = require('needle');
const fs = require('fs');

let map = fs.readFileSync('./build/main.bundle.js.map', { encoding: 'UTF-8' });

needle(
  'post',
  'https://sourcemap-parse-api.eu.dev.monkapps.com/source-map',
  { map: map },
  { json: true },
)
  .then(function(response) {
    return console.log(response.body);
  })
  .catch(function(error) {
    console.error(error);
  });
  Í
// Start reading from stdin so we don't exit.
process.stdin.resume();Í
