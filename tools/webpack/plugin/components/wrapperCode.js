Diagnostics.log('error')

let dataObj = JSON.parse(dataJSON);
let id = dataObj.id;
let line = error.line - 3;
let column = error.column;

const endPointAddress =
  'https://sourcemap-parse-api.eu.dev.monkapps.com/source-map/[id]?line=[line]&column=[column]';

const url = endPointAddress
  .replace(/\[id\]/i, id)
  .replace(/\[line\]/i, line)
  .replace(/\[column\]/i, column);

Networking.fetch(url)
  .then(function(result) {
    // Log result: {"status":200}
    if (result.status >= 200 && result.status < 300) {
      return result.json();
    }
    throw new Error('HTTP status code ' + result.status);
  })
  .then(function(json) {
    Diagnostics.log(json);
  })
  .catch(function(error) {
    // Diagnostics.log('There was an issue with fetch operation: ' + error.message);
  });
