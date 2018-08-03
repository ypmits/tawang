const Reactive = require('Reactive');
const Networking = require('Networking');
const Diagnostics = require('Diagnostics');

const url = 'https://ar-studio-local.com/api/error?line=1&column=1508';

Networking.fetch(url)
  .then(function(result) {
    Diagnostics.log(result);
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
    Diagnostics.log('There was an issue with fetch operation: ' + error.message);
  });
