throttle(function() {
  let id = DATA_OBJECT.id;

  const url = DATA_OBJECT.fullParseEndpointAddress.replace(/\[id\]/i, id);

  var errorMessage = '';
  // Getting locations from the stack trace.
  var stackTrace;

  if (errorParser.isValidJSError(error)) {
    // Parsing a valid JS error object
    errorMessage = errorParser.getTitleFromJSError(error);
    stackTrace = errorParser.getStackTraceFromJSError(error);
  } else if (errorParser.isValidNativeError(error)) {
    errorMessage = errorParser.getTitleFromNativeError(error);
    stackTrace = errorParser.getStackTraceFromNativeError(error);
  } else {
    // Just logging out the original error if it can't be parsed
    Diagnostics.log('Error could not be parsed. Original error:');
    Diagnostics.log(error);
    return;
  }

  // Assembling the option for the request
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      errors: stackTrace.store,
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
      string += errorMessage;

      // Stack trace
      for (var i = 0; i < json.length; i++) {
        currentLocation = json[i];

        string += '\n   at ' + currentLocation.line + ':' + currentLocation.column;

        // If there was a method name in the original error, this is added to the output.
        if (typeof stackTrace.store[i].methodName === 'string') {
          string += ' ' + stackTrace.store[i].methodName;
        }
        string += ' in ' + currentLocation.source;
      }

      // Logging the error.
      Diagnostics.log(string);
    })
    .catch(function(error) {
      Diagnostics.log('There was an issue with fetch operation: ' + error.message);
    });
});
