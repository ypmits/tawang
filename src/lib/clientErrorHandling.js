throttle(function() {

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

  errorSender.parse(stackTrace)
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

      // When webpack detects an error, it embeds a styled error
      // message in the code. 
      // Removing all color and styling from the string because it 
      // isn't displayed properly in AR Studio
      var stringWithoutColorCodes = string.replace(COLOR_CODE_REGEX, '');


      // Logging the error.
      Diagnostics.log(stringWithoutColorCodes);
    })
    .catch(function(error) {
      Diagnostics.log('There was an issue with fetch operation: ' + error.message);
    });
});
