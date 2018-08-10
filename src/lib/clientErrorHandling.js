throttle(function() {
  let id = DATA_OBJECT.id;

  const url = DATA_OBJECT.fullParseEndpointAddress.replace(/\[id\]/i, id);

  // Getting locations from the stack trace.
  errorArray = [];

  var lines = error.stack.split('\n');
  lines.forEach(function(line) {
    var parts = line.split(':');
    var line = parts[2] - DATA_OBJECT.linesOffset;
    var column = parts[3];

    errorArray.push({
      line: line,
      column: column,
    });
  });

  // Assembling the option for the request
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      errors: errorArray,
    }),
  };

  Networking.fetch(url, options)
    .then(function(result) {
      // Log result: {"status":200}
      if (result.status >= 200 && result.status < 300) {
        return result.json();
      }
      throw new Error('HTTP status code ' + result.status);
    })
    .then(function(json) {
      // Assembling the error message
      var string = '';

      // Error title
      string += error.name + ': ' + error.message;

      // Stack trace
      json.forEach(function(currentLocation) {
        string +=
          '\n   at ' +
          currentLocation.line +
          ':' +
          currentLocation.column +
          ' in ' +
          currentLocation.source;
      });

      // Logging the error.
      Diagnostics.log(string);
    })
    .catch(function(error) {
      Diagnostics.log('There was an issue with fetch operation: ' + error.message);
    });
});
