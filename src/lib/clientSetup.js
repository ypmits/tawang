const Diagnostics = require('Diagnostics');
const Networking = require('Networking');
const Time = require('Time');

var DATA_OBJECT = JSON.parse(DATA_JSON);

// RegEx matches all ANSI color/style codes.
const COLOR_CODE_REGEX = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

var dropError = false;

var throttleTime = 1000;
Time.setInterval(function() {
  dropError = false;
}, throttleTime);

function throttle(func) {
  if (!dropError) {
    func();
    dropError = true;
  }
}

var ErrorSender = function() {
  var id = DATA_OBJECT.id;

  this.url = DATA_OBJECT.fullParseEndpointAddress.replace(/\[id\]/i, id);
};

ErrorSender.prototype.parse = function(stackTrace) {
  // Assembling the option for the request
  var options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      errors: stackTrace.store,
    }),
  };

  return Networking.fetch(this.url, options).then(function(result) {
    // Log result: {"status":200}
    if (result.status >= 200 && result.status < 300) {
      return result.json();
    }
    throw new Error('HTTP status code ' + result.status);
  });
};

var errorSender = new ErrorSender();

var dev = {
  parse: function(line, column) {
    var stackTrace = new StackTrace();
    stackTrace.add(line - DATA_OBJECT.linesOffset, column);

    errorSender
      .parse(stackTrace)
      .then(function(json) {
        var object = json[0];

        var string = '';

        string += object.line + ':' + object.column;

        // If there was a method name in the original error, this is added to the output.
        if (typeof object.name === 'string') {
          string += ' ' + object.methodName;
        }
        string += ' in ' + object.source;
        Diagnostics.log(string);
      })
      .catch(function(error) {
        Diagnostics.log(error.message);
        Diagnostics.log(error.name);
        Diagnostics.log(error);
      });
  },
};

Diagnostics.log('Use dev.parse(line number, column number) to get original error location.')

/** A list of error locations. */
var StackTrace = function() {
  this.store = [];
};

/**
 * Adds a location to the stack trace.
 * @param {number} line The line number of the error.
 * @param {number} column The column number of the error.
 * @param {String} methodName The method name of the error.
 */
StackTrace.prototype.add = function(line, column, methodName) {
  if (typeof line == 'number' && typeof column === 'number') {
    var location = {
      line: line,
      column: column,
    };

    if (typeof methodName === 'string') {
      location.methodName = methodName;
    }

    this.store.push(location);
  }
};

/** Utilities for parsing errors. */
var ErrorParser = function() {
  this.errorStackStringRegEx = /(Backtrace:\n)((.*|\n)*)/m;
};

/**
 * Checks if the provided argument is a valid JS
 * error object.
 * @param {*} error Something to be checked.
 * @return {boolean} Boolean indicating wether the suplied argument is a valid JS error.
 */
ErrorParser.prototype.isValidJSError = function(error) {
  return typeof error === 'object' && typeof error.stack === 'string';
};

/**
 * Gets the error title from a valid JS error.
 * @param {Error} error A valid JS error object.
 * @return {String} The error title.
 */
ErrorParser.prototype.getTitleFromJSError = function(error) {
  return error.name + ': ' + error.message;
};

/**
 * Gets the stack trace from a valid JS error.
 * @param {Error} error A valid JS error object.
 * @return {StackTrace} The stack trace from the error.
 */
ErrorParser.prototype.getStackTraceFromJSError = function(error) {
  var stackTrace = new StackTrace();

  // Parsing the stack trace.
  var lines = error.stack.split('\n');
  lines.forEach(function(line) {
    var parts = line.split(':');
    var line = parseInt(parts[2]) - DATA_OBJECT.linesOffset;
    var column = parseInt(parts[3]);

    stackTrace.add(line, column);
  });

  return stackTrace;
};

/**
 * Checks if the provided error is a valid native
 * error string from AR Studio.
 * @param {*} error Something to be checked.
 * @return {boolean} Boolean indicating wether the suplied argument is a valid native error.
 */
ErrorParser.prototype.isValidNativeError = function(error) {
  var isString = typeof error === 'string';

  try {
    var stackTraceString = this.errorStackStringRegEx.exec(error)[2];
  } catch (error) {
    // Is not valid if the RegEx operation fails
    return false;
  }
  var hasStackTrace = typeof stackTraceString === 'string';

  return isString && hasStackTrace;
};

/**
 * Gets the error title from a valid native Error.
 * @param {String} error A valid native error string.
 * @return {String} The error title.
 */
ErrorParser.prototype.getTitleFromNativeError = function(error) {
  // Getting the error message.
  var errorMessageRegEx = /^(.*)$/m;
  return errorMessageRegEx.exec(error)[0];
};

/**
 * Gets the stack trace from a valid native error.
 * @param {String} error A valid native error string.
 * @return {StackTrace} The stack trace from the error.
 */
ErrorParser.prototype.getStackTraceFromNativeError = function(error) {
  var stackTrace = new StackTrace();

  // Getting the stack trace string.
  var errorStackString = this.errorStackStringRegEx.exec(error)[2];
  var stackLines = errorStackString.split('\n');

  // Parsing each line of the stack trace.
  for (var i = 0; i < stackLines.length; i++) {
    var currentLine = stackLines[i];

    // Checking if current line is still par of the stack trace.
    if (currentLine.includes('#' + i)) {
      // Removing the number from the line.
      var currentLineWithoutNumber = currentLine.substr(3) + '';
      if (currentLineWithoutNumber.includes('at')) {
        // Splitting the line at the 'at' word.
        var currentLineAtSplit = currentLineWithoutNumber.split('at');

        // Getting the method name
        var methodNameWithSpace = currentLineAtSplit[0];
        // Removing the space before the at
        var methodName = methodNameWithSpace.substr(0, methodNameWithSpace.length - 1);

        // Getting the loction string
        var locationWithSpace = currentLineAtSplit[1];
        // Removing the space after the at
        var location = locationWithSpace.substr(1);

        // Getting the index of the colon between the line and column number.
        var lineColonIndex = location.lastIndexOf(':');
        var file = location.substr(0, lineColonIndex);

        var lineString = location.substr(lineColonIndex + 1);

        if (!isNaN(lineString)) {
          var lineParsed = parseInt(lineString);

          stackTrace.add(lineParsed - DATA_OBJECT.linesOffset, 0, methodName);
        }
      }
    }
  }

  return stackTrace;
};

var errorParser = new ErrorParser();
