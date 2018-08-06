const request = require('request');

module.exports = (rawSourceMap) => {
  return new Promise((resolve, reject) => {
    request.post(
      {
        headers: { 'content-type': 'application/json' },
        url: 'https://sourcemap-parse-api.eu.dev.monkapps.com/source-map',
        body: JSON.stringify({ map: rawSourceMap }),
      },
      function(error, response, body) {
        if (error) {
          reject(error);
        } else {
          let bodyObj = JSON.parse(body)
          resolve(bodyObj);
        }
      },
    );
  });
}