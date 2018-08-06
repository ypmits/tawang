console.log('test');

let id = 'yx70jl2N5'
let line = 1;
let column = 1508; 


const endPointAddress = 'https://sourcemap-parse-api.eu.dev.monkapps.com/source-map/[id]?line=[line]&column=[column]';

const url = endPointAddress
  .replace(/\[id\]/i, id)
  .replace(/\[line\]/i, line)
  .replace(/\[column\]/i, column);

fetch(url)
  .then(function(result) {
    // Log result: {"status":200}
    if (result.status >= 200 && result.status < 300) {
      return result.json();
    }
    throw new Error("HTTP status code " + result.status);
  })
  .then(function(json) {
    Diagnostics.log(json)
    let line = json.line;
    let column = json.column;

    error.line = line;
    error.column = column;
    error.sourceURL = json.source;
    
    Diagnostics.log(error)
  })
  .catch(function(error) {
    /* Diagnostics.log(
      "There was an issue with fetch operation: " + error.message
    ); */
  });
console.log(url)