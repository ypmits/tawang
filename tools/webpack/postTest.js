var request = require('request');
var fs = require('fs');

let map = fs.readFileSync('./build/main.bundle.js.map', { encoding: 'UTF-8' });
console.log(map);

request.post(
  {
    headers: { 'content-type': 'application/json' },
    url: 'https://sourcemap-parse-api.eu.dev.monkapps.com/source-map',
    body: JSON.stringify({ map: map }),
  },
  function(error, response, body) {
    console.log(body);
  },
);
